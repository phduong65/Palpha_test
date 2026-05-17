<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $data['password'] = Hash::make($data['password']);

            $user = User::query()->create($data);

            return response()->json([
                'message' => 'Register successful.',
                'user' => $user,
                'token' => $user->createToken('api-token')->plainTextToken,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Register failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            $user = User::query()
                ->where('email', $data['email'])
                ->first();

            if (! $user || ! Hash::check($data['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            return response()->json([
                'message' => 'Login successful.',
                'user' => $user,
                'token' => $user->createToken('api-token')->plainTextToken,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Login failed. ' . $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successful.',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Logout failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
