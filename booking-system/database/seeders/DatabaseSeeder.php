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
            ['name' => 'Phòng Standard 101', 'capacity' => 2],
            ['name' => 'Phòng Standard 102', 'capacity' => 2],
            ['name' => 'Phòng Superior 201', 'capacity' => 2],
            ['name' => 'Phòng Deluxe 301', 'capacity' => 3],
            ['name' => 'Phòng Suite 401', 'capacity' => 4],
            ['name' => 'Phòng Family 501', 'capacity' => 5],
            ['name' => 'Phòng Family 502', 'capacity' => 5],
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
