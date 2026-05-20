/**
 * All personal data is stored in src/data/portfolio.json
 * Edit that file to update any information on the site.
 * This file just re-exports typed slices for use in components.
 */
import data from "@/data/portfolio.json";

export const profile   = data.profile;
export const experience = data.experience;
export const education  = data.education;
export const skills     = data.skills;
