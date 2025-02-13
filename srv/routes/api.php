<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskListController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API v1 routes
Route::prefix('v1')->group(function () {
    
    // Health check route (public)
    Route::get('health', function () {
        return response()->json([
            'status' => 'ok',
            'version' => '1.0.0',
            'timestamp' => now(),
            'service' => 'TaskForge API',
            'environment' => app()->environment(),
        ]);
    });
    
    // Public authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // Protected routes (require authentication) - using custom middleware
    Route::middleware('api.auth')->group(function () {
        
        // Authentication routes
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('user', [AuthController::class, 'user']);
        });
        
        // Alternative user route for testing
        Route::get('me', function (Request $request) {
            return response()->json([
                'data' => auth('sanctum')->user(),
                'meta' => [
                    'timestamp' => now()
                ]
            ]);
        });
        
        // Task Lists
        Route::apiResource('task-lists', TaskListController::class);
        Route::post('task-lists/reorder', [TaskListController::class, 'reorder']);
        
        // Tasks
        Route::apiResource('tasks', TaskController::class);
        Route::post('tasks/{task}/toggle', [TaskController::class, 'toggle']);
        Route::post('tasks/reorder', [TaskController::class, 'reorder']);
    });
});

// Global API fallback
Route::fallback(function () {
    return response()->json([
        'error' => [
            'message' => 'API endpoint not found',
            'code' => 'ENDPOINT_NOT_FOUND',
            'requested_path' => request()->path(),
        ],
        'meta' => [
            'timestamp' => now()
        ]
    ], 404);
});
