<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room_id' => $this->room_id,
            'user_name' => $this->user_name,
            'start_time' => optional($this->start_time)->format('Y-m-d H:i:s'),
            'end_time' => optional($this->end_time)->format('Y-m-d H:i:s'),
        ];
    }
}
