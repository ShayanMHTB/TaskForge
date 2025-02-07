<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->tasks();

        // Apply filters
        if ($request->has('list_id')) {
            $query->where('list_id', $request->list_id);
        }

        if ($request->has('completed')) {
            $query->where('completed', $request->boolean('completed'));
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Handle due date filters
        if ($request->has('due_date')) {
            switch ($request->due_date) {
                case 'today':
                    $query->whereDate('due_date', today());
                    break;
                case 'overdue':
                    $query->where('due_date', '<', now())
                          ->where('completed', false);
                    break;
                case 'this_week':
                    $query->whereBetween('due_date', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereBetween('due_date', [now()->startOfMonth(), now()->endOfMonth()]);
                    break;
            }
        }

        // Include relationships
        $includes = explode(',', $request->query('include', ''));
        if (in_array('list', $includes)) {
            $query->with('taskList:id,name,color');
        }
        if (in_array('tags', $includes)) {
            $query->with('tags:id,name,color');
        }

        // Sorting
        $sortField = $request->query('sort', 'position');
        $sortOrder = $request->query('order', 'asc');
        
        if (in_array($sortField, ['title', 'due_date', 'priority', 'created_at', 'position'])) {
            if ($sortField === 'priority') {
                // Custom priority sorting: high, medium, low
                $query->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END {$sortOrder}");
            } else {
                $query->orderBy($sortField, $sortOrder);
            }
        }

        // Pagination
        $perPage = min($request->query('per_page', 15), 100);
        $tasks = $query->paginate($perPage);

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'list_id' => 'nullable|exists:task_lists,id',
            'due_date' => 'nullable|date|after:now',
            'priority' => 'nullable|in:low,medium,high',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Verify task list belongs to user if provided
        if ($request->list_id) {
            $taskList = TaskList::find($request->list_id);
            if (!$taskList || $taskList->user_id !== Auth::id()) {
                return response()->json([
                    'error' => [
                        'message' => 'Invalid task list',
                        'code' => 'INVALID_TASK_LIST'
                    ]
                ], 422);
            }
        }

        // Get the next position within the list
        $maxPosition = Auth::user()->tasks()
            ->where('list_id', $request->list_id)
            ->max('position') ?? -1;

        $task = Auth::user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'list_id' => $request->list_id,
            'due_date' => $request->due_date,
            'priority' => $request->priority ?? 'medium',
            'position' => $maxPosition + 1,
        ]);

        // Attach tags if provided
        if ($request->has('tags')) {
            $userTags = Auth::user()->tags()->whereIn('id', $request->tags)->pluck('id');
            $task->tags()->attach($userTags);
        }

        // Load relationships
        $task->load(['taskList:id,name,color', 'tags:id,name,color']);

        return response()->json([
            'data' => $task,
            'meta' => [
                'message' => 'Task created successfully',
                'timestamp' => now()
            ]
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Task $task)
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        // Load relationships if requested
        $includes = explode(',', $request->query('include', ''));
        $relations = [];
        
        if (in_array('list', $includes)) {
            $relations[] = 'taskList:id,name,color';
        }
        if (in_array('tags', $includes)) {
            $relations[] = 'tags:id,name,color';
        }

        if (!empty($relations)) {
            $task->load($relations);
        }

        return response()->json([
            'data' => $task
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'list_id' => 'nullable|exists:task_lists,id',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high',
            'completed' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Verify task list belongs to user if changing lists
        if ($request->has('list_id') && $request->list_id) {
            $taskList = TaskList::find($request->list_id);
            if (!$taskList || $taskList->user_id !== Auth::id()) {
                return response()->json([
                    'error' => [
                        'message' => 'Invalid task list',
                        'code' => 'INVALID_TASK_LIST'
                    ]
                ], 422);
            }
        }

        $task->update($request->only([
            'title', 'description', 'list_id', 'due_date', 'priority', 'completed'
        ]));

        // Update tags if provided
        if ($request->has('tags')) {
            $userTags = Auth::user()->tags()->whereIn('id', $request->tags ?? [])->pluck('id');
            $task->tags()->sync($userTags);
        }

        // Load relationships
        $task->load(['taskList:id,name,color', 'tags:id,name,color']);

        return response()->json([
            'data' => $task,
            'meta' => [
                'message' => 'Task updated successfully',
                'timestamp' => now()
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Toggle task completion status
     */
    public function toggle(Task $task)
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        $task->toggleCompletion();

        return response()->json([
            'data' => [
                'id' => $task->id,
                'title' => $task->title,
                'completed' => $task->completed,
                'completed_at' => $task->completed ? now() : null,
                'updated_at' => $task->updated_at,
            ],
            'meta' => [
                'message' => $task->completed ? 'Task marked as completed' : 'Task marked as pending',
                'timestamp' => now()
            ]
        ]);
    }

    /**
     * Reorder tasks
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.position' => 'required|integer|min:0',
            'tasks.*.list_id' => 'nullable|exists:task_lists,id',
        ]);

        $updatedCount = 0;
        
        foreach ($request->tasks as $taskData) {
            $task = Task::find($taskData['id']);
            
            // Ensure the task belongs to the authenticated user
            if ($task && $task->user_id === Auth::id()) {
                $updateData = ['position' => $taskData['position']];
                
                // If moving between lists, verify the new list belongs to user
                if (isset($taskData['list_id'])) {
                    if ($taskData['list_id']) {
                        $taskList = TaskList::find($taskData['list_id']);
                        if ($taskList && $taskList->user_id === Auth::id()) {
                            $updateData['list_id'] = $taskData['list_id'];
                        }
                    } else {
                        $updateData['list_id'] = null;
                    }
                }
                
                $task->update($updateData);
                $updatedCount++;
            }
        }

        return response()->json([
            'meta' => [
                'message' => 'Tasks reordered successfully',
                'updated_count' => $updatedCount,
                'timestamp' => now()
            ]
        ]);
    }
}
