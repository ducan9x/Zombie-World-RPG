# SwisserAI FiveM Inventory Icon Pack

232 inventory item icons for FiveM, in one consistent 3D style, on transparent
backgrounds. Free to use for anything, including commercial servers. CC0, no
credit required.

## What's inside

| Folder | Format | Use |
| --- | --- | --- |
| `png-256/` | 256x256 PNG, transparent | The main set. Drop into `qb-inventory/html/images`. |
| `webp-256/` | 256x256 WebP | Same icons, ~70% smaller. For inventories that accept WebP. |
| `webp-100/` | 100x100 WebP | Game-native size, smallest download for your players. |
| `preview/` | PNG | Category sheets showing every icon with its filename. |

`items.json` lists every icon with its category and label.

## Install

**qb-inventory**

```
cp png-256/*.png resources/[qb]/qb-inventory/html/images/
```

**ox_inventory**

```
cp png-256/*.png resources/[ox]/ox_inventory/web/images/
```

Filenames follow the qb-core `shared/items.lua` naming, so most items match an
existing entry without any renaming. For anything custom, point the item's
`image` field at the matching file.

## Categories

- **Food** (`food`): 22 icons
- **Drinks** (`drink`): 18 icons
- **Medical** (`medical`): 16 icons
- **Ammunition** (`ammo`): 12 icons
- **Weapon Parts** (`weapon_parts`): 10 icons
- **Tools** (`tools`): 22 icons
- **Materials** (`materials`): 16 icons
- **Vehicle Parts** (`vehicle`): 22 icons
- **Electronics** (`tech`): 18 icons
- **Documents** (`documents`): 14 icons
- **Valuables** (`valuables`): 16 icons
- **Drugs** (`drugs`): 18 icons
- **Police & Evidence** (`police`): 16 icons
- **Misc** (`misc`): 12 icons

## Notes

The icons were generated with AI and then normalised through a fixed pipeline:
tight alpha crop, uniform fill ratio, centred on a square canvas. That is why
they sit the same way in a slot instead of jumping around in size.

No real-world trademarks are depicted. Where an item would normally reference a
brand, it uses a generic or GTA-lore equivalent.

## License

CC0 1.0 Universal, public domain. Use, modify, redistribute, sell servers with
them, no attribution needed. See LICENSE.txt.
