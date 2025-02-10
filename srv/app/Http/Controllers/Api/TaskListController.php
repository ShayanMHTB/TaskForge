<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->taskLists()->ordered();

        // Include tasks count if requested
        if ($request->query('include') && str_contains($request->query('include'), 'tasks_count')) {
            $query->withCount(['tasks', 'tasks as completed_tasks_count' => function ($q) {
                $q->where('completed', true);
            }]);
        }

        $taskLists = $query->get();

        return response()->json([
            'data' => $taskLists,
            'meta' => [
                'total' => $taskLists->count(),
                'timestamp' => now()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|regex:/^#[0-9a-fA-F]{6}$/',
        ]);

        // Get the next position
        $maxPosition = Auth::user()->taskLists()->max('position') ?? -1;

        $taskList = Auth::user()->taskLists()->create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color ?? '#3b82f6',
            'position' => $maxPosition + 1,
        ]);

        $taskList->loadCount(['tasks', 'tasks as completed_tasks_count' => function ($q) {
            $q->where('completed', true);
        }]);

        return response()->json([
            'data' => $taskList,
            'meta' => [
                'message' => 'Task list created successfully',
                'timestamp' => now()
            ]
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, TaskList $taskList)
    {
        // Ensure the task list belongs to the authenticated user
        if ($taskList->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task list not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        // Load relationships if requested
        $includes = explode(',', $request->query('include', ''));
        if (in_array('tasks', $includes)) {
            $taskList->load(['tasks' => function ($query) {
                $query->ordered();
            }]);
        }

        $taskList->loadCount(['tasks', 'tasks as completed_tasks_count' => function ($q) {
            $q->where('completed', true);
        }]);

        return response()->json([
            'data' => $taskList
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskList $taskList)
    {
        // Ensure the task list belongs to the authenticated user
        if ($taskList->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task list not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|regex:/^#[0-9a-fA-F]{6}$/',
        ]);

        $taskList->update($request->only(['name', 'description', 'color']));

        $taskList->loadCount(['tasks', 'tasks as completed_tasks_count' => function ($q) {
            $q->where('completed', true);
        }]);

        return response()->json([
            'data' => $taskList,
            'meta' => [
                'message' => 'Task list updated successfully',
                'timestamp' => now()
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $taskList)
    {
        // Ensure the task list belongs to the authenticated user
        if ($taskList->user_id !== Auth::id()) {
            return response()->json([
                'error' => [
                    'message' => 'Task list not found',
                    'code' => 'RESOURCE_NOT_FOUND'
                ]
            ], 404);
        }

        $taskList->delete();

        return response()->json(null, 204);
    }

    /**
     * Reorder task lists
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'lists' => 'required|array',
            'lists.*.id' => 'required|exists:task_lists,id',
            'lists.*.position' => 'required|integer|min:0',
        ]);

        $updatedCount = 0;
        
        foreach ($request->lists as $listData) {
            $taskList = TaskList::find($listData['id']);
            
            // Ensure the task list belongs to the authenticated user
            if ($taskList && $taskList->user_id === Auth::id()) {
                $taskList->update(['position' => $listData['position']]);
                $updatedCount++;
            }
        }

        return response()->json([
            'meta' => [
                'message' => 'Task lists reordered successfully',
                'updated_count' => $updatedCount,
                'timestamp' => now()
            ]
        ]);
    }
}
