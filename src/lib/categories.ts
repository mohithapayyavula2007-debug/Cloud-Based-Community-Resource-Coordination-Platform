export const CATEGORIES = [
  { key: 'food', label: 'Food & Meals', emoji: '🍞', color: 'bg-terracotta-soft/40 text-terracotta' },
  { key: 'tools', label: 'Tools & Gear', emoji: '🔨', color: 'bg-sage/40 text-moss-dark' },
  { key: 'skills', label: 'Skills & Time', emoji: '🤝', color: 'bg-ochre/30 text-ink' },
  { key: 'transport', label: 'Transportation', emoji: '🚗', color: 'bg-moss-light/40 text-moss-dark' },
  { key: 'shelter', label: 'Shelter & Housing', emoji: '🏡', color: 'bg-fog text-ink' },
  { key: 'childcare', label: 'Childcare', emoji: '🧸', color: 'bg-terracotta-soft/40 text-terracotta' },
  { key: 'medical', label: 'Medical Aid', emoji: '⚕️', color: 'bg-parchment text-terracotta' },
  { key: 'other', label: 'Other', emoji: '✨', color: 'bg-fog text-ink-soft' },
] as const

export type CategoryKey = typeof CATEGORIES[number]['key']

export function getCategory(key: string) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1]
}
