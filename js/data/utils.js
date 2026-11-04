import { AMMO } from './weapons/index.js';

export const CANNED_FOOD_IDS = ["hop_dao_vang", "hop_dau", "hop_thit_bo", "hop_quan_luong", "hop_ca_moi", "hop_ca_ngu", "hop_ca_thu_dao", "hop_ca_nuc"];

export const TOOL_WEAPON_IDS = ["can_xich_lon", "ong_sat", "xeng_sat", "cay_nay"];

export const V_TRADE_AMMO_TYPES = AMMO.filter(a => a.id !== "mui_ten").map(a => a.id);

export const LILI_REWARD_MEDICINE_IDS = ["day_bo_mau", "thuoc_sach_vet", "khang_sinh", "huyet_thanh"];

export const XIAOHAN_REWARD_FOOD_IDS = ["banh_quy_nen", "banh_mi_lua_mi", "hop_thit_bo"];
