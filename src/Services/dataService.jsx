import ecolesData from "../Data/ecoles.json";

// Helper function to remove accents and normalize strings
const normalizeString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim();
};

// Cache for normalized data to improve performance
let normalizedEcolesData = null;

const getNormalizedEcolesData = () => {
  if (!normalizedEcolesData) {
    normalizedEcolesData = ecolesData.map((ecole) => {
      // Collect ALL specialities from this school
      const allSchoolSpecialities = [
        ...(ecole.specialites || []),
        ...(ecole.filiereGestion || []),
        ...(ecole.filiereCommerce || []),
        ...(ecole.formationsOffertes || []),
        ...(ecole.mastersSpecialisesInitiale || []),
        ...(ecole.mastersSpecialisesUniversite || []),
        ...(ecole.licencesProfessionnelles || []),
        ...(ecole.debouches || []),
      ];

      return {
        ...ecole,
        normalizedName: normalizeString(ecole.nom || ""),
        normalizedVille: normalizeString(ecole.ville || ""),
        normalizedType: normalizeString(ecole.type || ""),
        normalizedSpecialites: allSchoolSpecialities.map((s) =>
          normalizeString(s)
        ),
      };
    });
  }
  return normalizedEcolesData;
};

export const dataService = {
  getAllEcoles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ecolesData);
      }, 100); // Reduced from 500ms for better performance
    });
  },

  getEcoleById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ecole = ecolesData.find((item) => item.idEcole === parseInt(id));
        if (ecole) {
          resolve(ecole);
        } else {
          reject(new Error("École non trouvée"));
        }
      }, 200); // Reduced from 300ms
    });
  },

  searchEcoles: (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!searchTerm || searchTerm.trim() === "") {
          resolve([]);
          return;
        }

        const searchLower = normalizeString(searchTerm);
        const normalizedData = getNormalizedEcolesData();

        const results = normalizedData
          .filter(
            (ecole) =>
              ecole.normalizedName.includes(searchLower) ||
              ecole.normalizedVille.includes(searchLower) ||
              ecole.normalizedType.includes(searchLower)
          )
          .map((ecole) => {
            // Return the original ecole object without normalized fields
            const {
              normalizedName,
              normalizedVille,
              normalizedType,
              normalizedSpecialites,
              ...originalEcole
            } = ecole;
            return originalEcole;
          });

        resolve(results);
      }, 200); // Reduced from 300ms
    });
  },

  filterEcoles: (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let normalizedData = getNormalizedEcolesData();

        // Apply filters with accent-insensitive comparison
        if (filters.ville) {
          const normalizedFilterVille = normalizeString(filters.ville);
          normalizedData = normalizedData.filter(
            (ecole) => ecole.normalizedVille === normalizedFilterVille
          );
        }

        if (filters.type) {
          const normalizedFilterType = normalizeString(filters.type);
          normalizedData = normalizedData.filter(
            (ecole) => ecole.normalizedType === normalizedFilterType
          );
        }

        if (filters.specialite) {
          const normalizedFilterSpecialite = normalizeString(
            filters.specialite
          );
          normalizedData = normalizedData.filter((ecole) => {
            // Check ALL speciality fields for this school
            const allSchoolSpecialities = [
              ...(ecole.specialites || []),
              ...(ecole.filiereGestion || []),
              ...(ecole.filiereCommerce || []),
              ...(ecole.formationsOffertes || []),
              ...(ecole.mastersSpecialisesInitiale || []),
              ...(ecole.mastersSpecialisesUniversite || []),
              ...(ecole.licencesProfessionnelles || []),
              ...(ecole.debouches || []),
            ].map((s) => normalizeString(s));

            return allSchoolSpecialities.includes(normalizedFilterSpecialite);
          });
        }

        // Convert back to original data format
        const results = normalizedData.map((ecole) => {
          const {
            normalizedName,
            normalizedVille,
            normalizedType,
            normalizedSpecialites,
            ...originalEcole
          } = ecole;
          return originalEcole;
        });

        resolve(results);
      }, 200); // Reduced from 400ms
    });
  },

  searchAndFilterEcoles: (searchTerm, filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let normalizedData = getNormalizedEcolesData();

        // Apply search if provided
        if (searchTerm && searchTerm.trim() !== "") {
          const searchLower = normalizeString(searchTerm);
          normalizedData = normalizedData.filter(
            (ecole) =>
              ecole.normalizedName.includes(searchLower) ||
              ecole.normalizedVille.includes(searchLower) ||
              ecole.normalizedType.includes(searchLower)
          );
        }

        // Apply filters
        if (filters.ville) {
          const normalizedFilterVille = normalizeString(filters.ville);
          normalizedData = normalizedData.filter(
            (ecole) => ecole.normalizedVille === normalizedFilterVille
          );
        }

        if (filters.type) {
          const normalizedFilterType = normalizeString(filters.type);
          normalizedData = normalizedData.filter(
            (ecole) => ecole.normalizedType === normalizedFilterType
          );
        }

        if (filters.specialite) {
          const normalizedFilterSpecialite = normalizeString(
            filters.specialite
          );
          normalizedData = normalizedData.filter((ecole) => {
            // Check ALL speciality fields for this school
            const allSchoolSpecialities = [
              ...(ecole.specialites || []),
              ...(ecole.filiereGestion || []),
              ...(ecole.filiereCommerce || []),
              ...(ecole.formationsOffertes || []),
              ...(ecole.mastersSpecialisesInitiale || []),
              ...(ecole.mastersSpecialisesUniversite || []),
              ...(ecole.licencesProfessionnelles || []),
              ...(ecole.debouches || []),
            ].map((s) => normalizeString(s));

            return allSchoolSpecialities.includes(normalizedFilterSpecialite);
          });
        }

        // Apply price filter if present
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          const minPrice = filters.minPrice || 0;
          const maxPrice = filters.maxPrice || 1000000;

          normalizedData = normalizedData.filter((ecole) => {
            const priceStr = ecole.cout || "0";
            const match = priceStr.match(/\d+/g);
            const price = match ? parseInt(match.join("")) : 0;
            return price >= minPrice && price <= maxPrice;
          });
        }

        // Convert back to original data format
        const results = normalizedData.map((ecole) => {
          const {
            normalizedName,
            normalizedVille,
            normalizedType,
            normalizedSpecialites,
            ...originalEcole
          } = ecole;
          return originalEcole;
        });

        resolve(results);
      }, 200);
    });
  },

  getVilles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const villes = [
          ...new Set(ecolesData.map((ecole) => ecole.ville)),
        ].sort();
        resolve(villes);
      }, 100); // Reduced from 200ms
    });
  },

  getTypes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const types = [
          ...new Set(ecolesData.map((ecole) => ecole.type)),
        ].sort();
        resolve(types);
      }, 100); // Reduced from 200ms
    });
  },

  getSpecialites: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get ALL specialities from ALL possible fields
        const allSpecialites = new Set();

        ecolesData.forEach((ecole) => {
          // Check all possible speciality arrays
          const specialityFields = [
            "specialites",
            "filiereGestion",
            "filiereCommerce",
            "formationsOffertes",
            "mastersSpecialisesInitiale",
            "mastersSpecialisesUniversite",
            "licencesProfessionnelles",
            "debouches",
          ];

          specialityFields.forEach((field) => {
            if (ecole[field] && Array.isArray(ecole[field])) {
              ecole[field].forEach((item) => {
                if (item && typeof item === "string") {
                  // Clean up the speciality string
                  const cleanItem = item.trim();
                  if (cleanItem.length > 0) {
                    allSpecialites.add(cleanItem);
                  }
                }
              });
            }
          });
        });

        const specialites = Array.from(allSpecialites).sort();
        resolve(specialites);
      }, 100); // Reduced from 200ms
    });
  },

  getFilterOptions: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const villesMap = new Map();
        const typesMap = new Map();
        const specialitesMap = new Map();

        ecolesData.forEach((ecole) => {
          // Ville
          if (ecole.ville) {
            const label = ecole.ville.trim();
            const key = normalizeString(label);
            villesMap.set(key, label);
          }

          // Type
          if (ecole.type) {
            const label = ecole.type.trim();
            const key = normalizeString(label);
            typesMap.set(key, label);
          }

          // Specialités (ALL fields)
          const specialityFields = [
            "specialites",
            "filiereGestion",
            "filiereCommerce",
            "formationsOffertes",
            "mastersSpecialisesInitiale",
            "mastersSpecialisesUniversite",
            "licencesProfessionnelles",
            "debouches",
          ];

          specialityFields.forEach((field) => {
            if (Array.isArray(ecole[field])) {
              ecole[field].forEach((item) => {
                if (item) {
                  const label = item.trim();
                  const key = normalizeString(label);
                  specialitesMap.set(key, label);
                }
              });
            }
          });
        });

        resolve({
          villes: [...villesMap.values()].sort((a, b) =>
            a.localeCompare(b, "fr")
          ),
          types: [...typesMap.values()].sort((a, b) =>
            a.localeCompare(b, "fr")
          ),
          specialites: [...specialitesMap.values()].sort((a, b) =>
            a.localeCompare(b, "fr")
          ),
        });
      }, 100);
    });
  },

  // New method for accent-insensitive suggestions
  getSearchSuggestions: (searchTerm, limit = 5) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!searchTerm || searchTerm.trim() === "") {
          resolve([]);
          return;
        }

        const searchLower = normalizeString(searchTerm);
        const normalizedData = getNormalizedEcolesData();

        const suggestions = normalizedData
          .filter(
            (ecole) =>
              ecole.normalizedName.includes(searchLower) ||
              ecole.normalizedVille.includes(searchLower) ||
              ecole.normalizedType.includes(searchLower)
          )
          .slice(0, limit)
          .map((ecole) => ({
            id: ecole.idEcole,
            name: ecole.nom,
            type: ecole.type,
            ville: ecole.ville,
            score: calculateRelevanceScore(ecole, searchLower),
          }))
          .sort((a, b) => b.score - a.score);

        resolve(suggestions);
      }, 100);
    });
  },

  // Helper method for accent normalization
  normalizeString: (str) => {
    return normalizeString(str);
  },
};

// Helper function to calculate relevance score for suggestions
function calculateRelevanceScore(ecole, searchTerm) {
  let score = 0;

  // Name matches get highest score
  if (ecole.normalizedName.includes(searchTerm)) {
    score += 100;
    // Exact name match gets extra points
    if (ecole.normalizedName === searchTerm) {
      score += 50;
    }
  }

  // Type matches get medium score
  if (ecole.normalizedType.includes(searchTerm)) {
    score += 30;
  }

  // Ville matches get lower score
  if (ecole.normalizedVille.includes(searchTerm)) {
    score += 20;
  }

  return score;
}

// Performance optimization: pre-normalize data on module load
getNormalizedEcolesData();

// Add this test function at the end of your dataService.js file
export const testFilterOptions = () => {
  console.log("=== TESTING FILTER OPTIONS ===");

  // Test 1: Check total schools
  console.log("Total schools:", ecolesData.length);

  // Test 2: Check first school
  console.log("First school:", ecolesData[0]?.nom);
  console.log("First school ville:", ecolesData[0]?.ville);
  console.log("First school type:", ecolesData[0]?.type);
  console.log("First school specialites:", ecolesData[0]?.specialites);

  // Test 3: Collect all villes manually
  const allVilles = new Set();
  ecolesData.forEach((school) => {
    if (school.ville) allVilles.add(school.ville);
  });
  console.log("All villes found:", Array.from(allVilles).sort());

  // Test 4: Collect all types manually
  const allTypes = new Set();
  ecolesData.forEach((school) => {
    if (school.type) allTypes.add(school.type);
  });
  console.log("All types found:", Array.from(allTypes).sort());

  // Test 5: Collect all specialites manually
  const allSpecialites = new Set();
  ecolesData.forEach((school) => {
    // Check all possible arrays
    const arraysToCheck = [
      school.specialites,
      school.filiereGestion,
      school.filiereCommerce,
      school.formationsOffertes,
      school.mastersSpecialisesInitiale,
      school.mastersSpecialisesUniversite,
      school.licencesProfessionnelles,
      school.debouches,
    ];

    arraysToCheck.forEach((array) => {
      if (Array.isArray(array)) {
        array.forEach((item) => {
          if (item && typeof item === "string") {
            allSpecialites.add(item.trim());
          }
        });
      }
    });
  });
  console.log("All specialites found:", Array.from(allSpecialites).sort());
  console.log("Number of specialites:", allSpecialites.size);

  console.log("=== END TEST ===");
};
