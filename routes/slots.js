import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)?.trim();

const router = express.Router();
const supabase =
  supabaseUrl?.startsWith("https://") && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Default 4 slot kalo room baru
const defaultSlots = {
  slot_1: {
    slot_id: 1,
    status: "DISABLED",
    source_type: null,
    source_name: null,
    stream_id: null,
    is_primary: false,
  },
  slot_2: {
    slot_id: 2,
    status: "DISABLED",
    source_type: null,
    source_name: null,
    stream_id: null,
    is_primary: false,
  },
  slot_3: {
    slot_id: 3,
    status: "DISABLED",
    source_type: null,
    source_name: null,
    stream_id: null,
    is_primary: false,
  },
  slot_4: {
    slot_id: 4,
    status: "DISABLED",
    source_type: null,
    source_name: null,
    stream_id: null,
    is_primary: false,
  },
};

// GET /:room_id - Ambil status 4 slot
router.get("/:room_id", async (req, res) => {
  try {
    const { room_id } = req.params;

    if (!supabase) {
      return res.json({ room_id, ...defaultSlots, fallback: true });
    }

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_id", room_id)
      .single();

    if (error || !data) {
      return res.json({ room_id, ...defaultSlots });
    }

    res.json(data);
  } catch (error) {
    console.error("Error getting slots:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /update - Update 1 slot
router.post("/update", async (req, res) => {
  try {
    const {
      room_id,
      slot_id,
      status,
      source_type,
      source_name,
      stream_id,
      is_primary,
    } = req.body;

    if (!supabase) {
      return res.json({
        success: false,
        fallback: true,
        error: "Supabase belum dikonfigurasi",
      });
    }

    // Ambil data room sekarang
    let { data: room } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_id", room_id)
      .single();

    if (!room) {
      room = { room_id, ...defaultSlots };
    }

    // Update slot yang diminta
    const slotKey = `slot_${slot_id}`;
    room[slotKey] = {
      slot_id,
      status: status || "DISABLED",
      source_type: source_type || null,
      source_name: source_name || null,
      stream_id: stream_id || null,
      is_primary: is_primary || false,
    };

    // Upsert ke Supabase
    const { data, error } = await supabase
      .from("rooms")
      .upsert(room)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
