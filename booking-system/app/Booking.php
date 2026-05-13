<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';

    protected $fillable = [
        'room_id',
        'user_name',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'start_time' => 'datetime:Y-m-d H:i:s',
        'end_time' => 'datetime:Y-m-d H:i:s',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
