export const TRADER_WEAPON_SHOP = [
  { weaponId: "G17", type: "ranged", costMin: 10, costMax: 15 },
  { weaponId: "GP100", type: "ranged", costMin: 10, costMax: 15 },
  { weaponId: "USP9", type: "ranged", costMin: 10, costMax: 15 },
  { weaponId: "riu_cuu_hoa", type: "melee", costMin: 5, costMax: 7 },
  { weaponId: "gay_cam_sat", type: "melee", costMin: 3, costMax: 5 },
  { weaponId: "gay_bong_chay", type: "melee", costMin: 2, costMax: 3 },
];

export const FIXED_LOOT_DROPS = {
  banker_kill: { weaponId: "dao_samurai", type: "melee" },
  leader_gift: { weaponId: "dao_ngang_duong", type: "melee" },
  doctor_trade: { weaponId: "M700", type: "ranged", ammoId: "7.62×51mm", ammoCount: 30 },
  outlaw_kill: { weaponId: "AK47", type: "ranged", ammoId: "7.62×39mm", ammoCount: 30 },
  shadow_kill: { weaponId: "GP100", type: "ranged", ammoId: ".357 Magnum", ammoCount: 20 },
  space_crate: { weaponId: "AWM", type: "ranged", ammoId: ".300 Winchester Magnum", ammoCount: 30 },
  tunnel_cache: { ammoId: "9×19mm", ammoCount: 20, foodId: "banh_quy_nen" },
};

export const TRADE_TEMPLATES = [
  { ammoType: "9×19mm", ammoPerItem: 5 },
  { ammoType: ".357 Magnum", ammoPerItem: 3 },
  { ammoType: "9×19mm", ammoPerItem: 4 },
  { ammoType: ".357 Magnum", ammoPerItem: 4 },
];
