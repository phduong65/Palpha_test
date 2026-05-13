<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('rooms')->insert([
            [
                'name' => 'Phòng Standard 101',
                'capacity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Standard 102',
                'capacity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Superior 201',
                'capacity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Deluxe 301',
                'capacity' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Suite 401',
                'capacity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phòng Family 501',
                'capacity' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
