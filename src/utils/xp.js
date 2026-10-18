export function xpRequiredForLevel(level) {
  return Math.floor(50 * Math.pow(level, 1.5));
}

export function getLevelFromXp(totalXp) {
  let level = 0;
  while (true) {
    const nextReq = xpRequiredForLevel(level + 1);
    if (totalXp >= nextReq) {
      level += 1;
    } else {
      return level;
    }
  }
}

export function calculateSessionXp(durationSeconds, rng = Math.random) {
  const minutes = Math.floor(durationSeconds / 60);
  let xp = 0;

  for (let i = 0; i < minutes; i += 1) {
    xp += Math.floor(rng() * 7) + 4;
  }

  const jackpotRoll = rng();
  if (jackpotRoll < 0.05) {
    const bonus = Math.floor(rng() * 17) + 20;
    return { xp, bonus, type: 'jackpot', totalXp: xp + bonus };
  }

  const luckyRoll = rng();
  if (luckyRoll < 0.25) {
    return { xp, bonus: 0, type: 'lucky', totalXp: xp * 2 };
  }

  return { xp, bonus: 0, type: 'normal', totalXp: xp };
}
