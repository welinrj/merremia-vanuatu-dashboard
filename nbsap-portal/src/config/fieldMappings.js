export default {
  "global": {
    "name": ["name", "site_name", "area_name", "site_nm", "NAME", "Name", "SITE_NAME", "AREA_NAME", "label", "LABEL", "title", "TITLE"],
    "type": ["type", "TYPE", "Type", "category", "CATEGORY", "designation", "DESIGNATION", "desig", "DESIG", "class", "CLASS"],
    "realm": ["realm", "REALM", "Realm", "domain", "DOMAIN", "environment", "ENVIRONMENT"],
    "province": ["province", "PROVINCE", "Province", "state", "STATE", "region", "REGION", "island", "ISLAND", "prov", "PROV"],
    "year": ["year", "YEAR", "Year", "est_year", "EST_YEAR", "date", "DATE", "year_est", "YEAR_EST", "established"],
    "status": ["status", "STATUS", "Status", "condition", "CONDITION", "state", "mgmt_status"],
    "source": ["source", "SOURCE", "Source", "data_src", "DATA_SRC", "origin", "ORIGIN", "provider"],
    "notes": ["notes", "NOTES", "Notes", "comments", "COMMENTS", "description", "DESCRIPTION", "desc", "DESC", "remarks", "REMARKS"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL"],
    "coverage_category": ["coverage_category", "COVERAGE_CATEGORY", "cover_class", "density_class", "severity", "SEVERITY"],
    "threat_level": ["threat_level", "THREAT_LEVEL", "threat", "THREAT", "risk_level", "RISK_LEVEL"],
    "species": ["species", "SPECIES", "species_name", "SPECIES_NAME", "sci_name", "SCI_NAME", "taxon", "TAXON"]
  },
  "CCA": {
    "name": ["cca_name", "CCA_NAME", "community_area", "COMMUNITY_AREA", "tabu_name"],
    "type": ["cca_type", "CCA_TYPE", "tabu_type"]
  },
  "MPA": {
    "name": ["mpa_name", "MPA_NAME", "marine_area", "MARINE_AREA"],
    "type": ["mpa_type", "MPA_TYPE", "protection_level"]
  },
  "PA": {
    "name": ["pa_name", "PA_NAME", "park_name", "PARK_NAME", "protected_area"],
    "type": ["pa_type", "PA_TYPE", "iucn_cat", "IUCN_CAT"]
  },
  "OECM": {
    "name": ["oecm_name", "OECM_NAME"],
    "type": ["oecm_type", "OECM_TYPE"]
  },
  "KBA": {
    "name": ["kba_name", "KBA_NAME", "iba_name"],
    "type": ["kba_type", "KBA_TYPE", "trigger"]
  },
  "LMMA": {
    "name": ["lmma_name", "LMMA_NAME", "managed_area"],
    "type": ["lmma_type", "LMMA_TYPE", "management_type"]
  },
  "SPATIAL_PLAN": {
    "name": ["plan_name", "PLAN_NAME", "spatial_plan"],
    "type": ["plan_type", "PLAN_TYPE", "planning_zone"]
  },
  "DEGRADED": {
    "name": ["degraded_name", "site_name", "SITE_NAME"],
    "type": ["degradation_type", "DEGRADATION_TYPE", "deg_type", "cause"]
  },
  "RESTORATION": {
    "name": ["restoration_name", "project_name", "PROJECT_NAME"],
    "type": ["restoration_type", "activity"]
  },
  "SPECIES_DIST": {
    "name": ["species_name", "SPECIES_NAME", "common_name", "sci_name"],
    "type": ["species_type", "taxa", "TAXA", "group"]
  },
  "MEGAPODE": {
    "name": ["site_name", "SITE_NAME", "nesting_site", "location", "name"],
    "type": ["obs_type", "record_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "STARLING": {
    "name": ["site_name", "SITE_NAME", "location", "name"],
    "type": ["obs_type", "record_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "FANTAIL": {
    "name": ["site_name", "SITE_NAME", "location", "name"],
    "type": ["obs_type", "record_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "KINGFISHER": {
    "name": ["site_name", "SITE_NAME", "location", "name"],
    "type": ["obs_type", "record_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "FLYING_FOX": {
    "name": ["site_name", "SITE_NAME", "roost_name", "colony", "location", "name"],
    "type": ["obs_type", "record_type", "colony_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "PLERANDRA": {
    "name": ["site_name", "SITE_NAME", "population", "location", "name"],
    "type": ["obs_type", "record_type", "habitat_type", "method", "status"],
    "presence": ["presence", "PRESENCE", "Presence", "seasonal", "SEASONAL", "origin", "ORIGIN"]
  },
  "INVASIVE": {
    "name": ["species_name", "SPECIES", "invasive_name", "ias_name"],
    "type": ["invasive_type", "threat_type", "species_type", "ias_type"]
  },
  "MERREMIA": {
    "name": ["site_name", "detection_id", "SITE_NAME", "patch_id"],
    "type": ["detection_method", "confidence", "CONFIDENCE", "source_type"],
    "coverage_category": ["coverage", "COVERAGE", "density", "DENSITY", "cover_class", "severity"]
  },
  "CROWN_OF_THORNS": {
    "name": ["site_name", "SITE_NAME", "reef_name", "survey_site", "location"],
    "type": ["outbreak_status", "survey_type", "method", "status"],
    "coverage_category": ["density_class", "DENSITY", "outbreak_level", "severity"]
  },
  "MILE_A_MINUTE": {
    "name": ["site_name", "SITE_NAME", "patch_name", "location", "plot_id"],
    "type": ["infestation_type", "control_status", "method", "status"],
    "coverage_category": ["coverage", "COVERAGE", "density", "cover_class", "severity"]
  },
  "SOLANUM_TORVUM": {
    "name": ["site_name", "SITE_NAME", "patch_name", "location"],
    "type": ["infestation_type", "control_status", "method", "status"],
    "coverage_category": ["coverage", "COVERAGE", "density", "cover_class", "severity"]
  },
  "PESTICIDE": {
    "name": ["farm_name", "FARM_NAME", "site_name", "operator"],
    "type": ["chemical_type", "pesticide_type", "PESTICIDE_TYPE", "product"]
  },
  "EUTROPHICATION": {
    "name": ["zone_name", "ZONE_NAME", "site_name", "station"],
    "type": ["severity", "SEVERITY", "nutrient_level", "trophic_state"]
  },
  "LAND_COVER": {
    "name": ["class_name", "CLASS_NAME", "cover_type", "land_use", "Land_Use_P", "LAND_USE_P"],
    "type": ["lc_class", "LC_CLASS", "land_cover", "LAND_COVER", "use_type", "Land_Use_P", "LAND_USE_P", "land_use_p"]
  },
  "GREEN_SPACE": {
    "name": ["park_name", "PARK_NAME", "space_name", "garden_name"],
    "type": ["space_type", "SPACE_TYPE", "park_type", "green_type"]
  }
};
