<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            ['name' => 'Phong Standard 101', 'capacity' => 2],
            ['name' => 'Phong Standard 102', 'capacity' => 2],
            ['name' => 'Phong Superior 201', 'capacity' => 2],
            ['name' => 'Phong Deluxe 301', 'capacity' => 3],
            ['name' => 'Phong Suite 401', 'capacity' => 4],
            ['name' => 'Phong Family 501', 'capacity' => 5],
        ];

        foreach ($rooms as $room) {
            Room::query()->updateOrCreate(
                ['name' => $room['name']],
                ['capacity' => $room['capacity']]
            );
        }

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
