<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'position',
        'user_id',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    /**
     * Get the user that owns the task list
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all tasks in this list
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'list_id');
    }

    /**
     * Get completed tasks count
     */
    public function completedTasksCount(): int
    {
        return $this->tasks()->where('completed', true)->count();
    }

    /**
     * Get pending tasks count
     */
    public function pendingTasksCount(): int
    {
        return $this->tasks()->where('completed', false)->count();
    }

    /**
     * Scope to get lists for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to order by position
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('position');
    }
}
