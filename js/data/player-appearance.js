/* ============================================================
   Player Appearance Manifest & Registry — Zombie World RPG
   Định nghĩa 30 tổ hợp ngoại hình nhân vật người chơi (Pre-generated).
   ============================================================ */

export const AGE_OPTIONS = [
  {
    "id": "teen",
    "name": "Thanh thiếu niên"
  },
  {
    "id": "young_adult",
    "name": "Thanh niên"
  },
  {
    "id": "adult",
    "name": "Trưởng thành"
  },
  {
    "id": "middle_aged",
    "name": "Trung niên"
  },
  {
    "id": "elderly",
    "name": "Cao tuổi"
  }
];

export const GENDER_OPTIONS = [
  {
    "id": "male",
    "name": "Nam"
  },
  {
    "id": "female",
    "name": "Nữ"
  }
];

export const OUTFIT_OPTIONS = [
  {
    "id": "survivor",
    "name": "Trang phục sinh tồn cơ bản"
  },
  {
    "id": "tactical",
    "name": "Trang phục chiến thuật"
  },
  {
    "id": "casual",
    "name": "Trang phục thường ngày"
  }
];

export const DEFAULT_APPEARANCE = {
  age: 'young_adult',
  gender: 'male',
  outfit: 'survivor',
  id: 'young_adult_male_survivor',
  filename: 'young_adult_male_survivor.png',
  path: 'public/assets/characters/player/young_adult_male_survivor.png',
  status: 'PENDING'
};

export const PLAYER_APPEARANCE_MANIFEST = [
  {
    "id": "teen_male_survivor",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "teen_male_survivor.png",
    "path": "public/assets/characters/player/teen_male_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "teen_male_tactical",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "teen_male_tactical.png",
    "path": "public/assets/characters/player/teen_male_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "teen_male_casual",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "teen_male_casual.png",
    "path": "public/assets/characters/player/teen_male_casual.png",
    "status": "PENDING"
  },
  {
    "id": "teen_female_survivor",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "teen_female_survivor.png",
    "path": "public/assets/characters/player/teen_female_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "teen_female_tactical",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "teen_female_tactical.png",
    "path": "public/assets/characters/player/teen_female_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "teen_female_casual",
    "age": "teen",
    "ageName": "Thanh thiếu niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "teen_female_casual.png",
    "path": "public/assets/characters/player/teen_female_casual.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_male_survivor",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "young_adult_male_survivor.png",
    "path": "public/assets/characters/player/young_adult_male_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_male_tactical",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "young_adult_male_tactical.png",
    "path": "public/assets/characters/player/young_adult_male_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_male_casual",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "young_adult_male_casual.png",
    "path": "public/assets/characters/player/young_adult_male_casual.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_female_survivor",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "young_adult_female_survivor.png",
    "path": "public/assets/characters/player/young_adult_female_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_female_tactical",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "young_adult_female_tactical.png",
    "path": "public/assets/characters/player/young_adult_female_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "young_adult_female_casual",
    "age": "young_adult",
    "ageName": "Thanh niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "young_adult_female_casual.png",
    "path": "public/assets/characters/player/young_adult_female_casual.png",
    "status": "PENDING"
  },
  {
    "id": "adult_male_survivor",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "adult_male_survivor.png",
    "path": "public/assets/characters/player/adult_male_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "adult_male_tactical",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "adult_male_tactical.png",
    "path": "public/assets/characters/player/adult_male_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "adult_male_casual",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "adult_male_casual.png",
    "path": "public/assets/characters/player/adult_male_casual.png",
    "status": "PENDING"
  },
  {
    "id": "adult_female_survivor",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "adult_female_survivor.png",
    "path": "public/assets/characters/player/adult_female_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "adult_female_tactical",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "adult_female_tactical.png",
    "path": "public/assets/characters/player/adult_female_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "adult_female_casual",
    "age": "adult",
    "ageName": "Trưởng thành",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "adult_female_casual.png",
    "path": "public/assets/characters/player/adult_female_casual.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_male_survivor",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "middle_aged_male_survivor.png",
    "path": "public/assets/characters/player/middle_aged_male_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_male_tactical",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "middle_aged_male_tactical.png",
    "path": "public/assets/characters/player/middle_aged_male_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_male_casual",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "middle_aged_male_casual.png",
    "path": "public/assets/characters/player/middle_aged_male_casual.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_female_survivor",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "middle_aged_female_survivor.png",
    "path": "public/assets/characters/player/middle_aged_female_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_female_tactical",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "middle_aged_female_tactical.png",
    "path": "public/assets/characters/player/middle_aged_female_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "middle_aged_female_casual",
    "age": "middle_aged",
    "ageName": "Trung niên",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "middle_aged_female_casual.png",
    "path": "public/assets/characters/player/middle_aged_female_casual.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_male_survivor",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "elderly_male_survivor.png",
    "path": "public/assets/characters/player/elderly_male_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_male_tactical",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "elderly_male_tactical.png",
    "path": "public/assets/characters/player/elderly_male_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_male_casual",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "male",
    "genderName": "Nam",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "elderly_male_casual.png",
    "path": "public/assets/characters/player/elderly_male_casual.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_female_survivor",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "survivor",
    "outfitName": "Trang phục sinh tồn cơ bản",
    "filename": "elderly_female_survivor.png",
    "path": "public/assets/characters/player/elderly_female_survivor.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_female_tactical",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "tactical",
    "outfitName": "Trang phục chiến thuật",
    "filename": "elderly_female_tactical.png",
    "path": "public/assets/characters/player/elderly_female_tactical.png",
    "status": "PENDING"
  },
  {
    "id": "elderly_female_casual",
    "age": "elderly",
    "ageName": "Cao tuổi",
    "gender": "female",
    "genderName": "Nữ",
    "outfit": "casual",
    "outfitName": "Trang phục thường ngày",
    "filename": "elderly_female_casual.png",
    "path": "public/assets/characters/player/elderly_female_casual.png",
    "status": "PENDING"
  }
];

/**
 * Tìm thông tin tổ hợp ngoại hình theo 3 thuộc tính
 * @param {string} age - teen | young_adult | adult | middle_aged | elderly
 * @param {string} gender - male | female
 * @param {string} outfit - survivor | tactical | casual
 * @returns {Object} Thông tin cấu hình ngoại hình
 */
export function getAppearanceConfig(age, gender, outfit) {
  const safeAge = age || DEFAULT_APPEARANCE.age;
  const safeGender = gender || DEFAULT_APPEARANCE.gender;
  const safeOutfit = outfit || DEFAULT_APPEARANCE.outfit;
  const id = `${safeAge}_${safeGender}_${safeOutfit}`;
  
  const found = PLAYER_APPEARANCE_MANIFEST.find(item => item.id === id);
  return found || {
    ...DEFAULT_APPEARANCE,
    id,
    age: safeAge,
    gender: safeGender,
    outfit: safeOutfit,
    filename: `${id}.png`,
    path: `public/assets/characters/player/${id}.png`,
    status: 'PENDING'
  };
}

/**
 * Lấy nhãn hiển thị tiếng Việt của ngoại hình
 * @param {Object} appearance 
 * @returns {string} Chuỗi mô tả ngắn
 */
export function getAppearanceDisplayName(appearance) {
  if (!appearance) return 'Chưa chọn';
  const a = AGE_OPTIONS.find(x => x.id === appearance.age)?.name || appearance.age;
  const g = GENDER_OPTIONS.find(x => x.id === appearance.gender)?.name || appearance.gender;
  const o = OUTFIT_OPTIONS.find(x => x.id === appearance.outfit)?.name || appearance.outfit;
  return `${g}, ${a} (${o})`;
}
