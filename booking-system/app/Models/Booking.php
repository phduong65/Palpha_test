<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['room_id', 'user_name', 'start_time', 'end_time'])]
class Booking extends Model
{
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:Y-m-d H:i:s',
            'end_time' => 'datetime:Y-m-d H:i:s',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
