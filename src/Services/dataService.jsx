// src/Services/dataService.js - COMPLETE VERSION
import ecolesData from '../Data/ecoles.json';

export const dataService = {
  // Get all schools
  getAllEcoles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ecolesData);
      }, 500);
    });
  },

  // Get school by ID
  getEcoleById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ecole = ecolesData.find(item => item.idEcole === parseInt(id));
        if (ecole) {
          resolve(ecole);
        } else {
          reject(new Error('École non trouvée'));
        }
      }, 300);
    });
  },

  // Search schools - ONLY by school name (nom)
  searchEcoles: (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchLower = searchTerm.toLowerCase();
        
        // Search ONLY by school name (nom)
        const results = ecolesData.filter(ecole => 
          ecole.nom.toLowerCase().includes(searchLower)
        );
        
        resolve(results);
      }, 300);
    });
  },

  // Filter schools
  filterEcoles: (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...ecolesData];
        
        if (filters.ville) {
          results = results.filter(ecole => 
            ecole.ville.toLowerCase() === filters.ville.toLowerCase()
          );
        }
        
        if (filters.type) {
          results = results.filter(ecole => 
            ecole.type === filters.type
          );
        }
        
        if (filters.specialite) {
          results = results.filter(ecole => 
            ecole.specialites && 
            ecole.specialites.includes(filters.specialite)
          );
        }
        
        resolve(results);
      }, 400);
    });
  },

  // Get all unique cities (villes)
  getVilles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const villes = [...new Set(ecolesData.map(ecole => ecole.ville))].sort();
        resolve(villes);
      }, 200);
    });
  },

  // Get all unique types
  getTypes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const types = [...new Set(ecolesData.map(ecole => ecole.type))].sort();
        resolve(types);
      }, 200);
    });
  },

  // Get all unique specialties
  getSpecialites: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Flatten all specialties arrays and get unique values
        const allSpecialites = ecolesData.flatMap(ecole => ecole.specialites || []);
        const specialites = [...new Set(allSpecialites)].sort();
        resolve(specialites);
      }, 200);
    });
  },

  // Get all filter options at once
  getFilterOptions: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const villes = [...new Set(ecolesData.map(ecole => ecole.ville))].sort();
        const types = [...new Set(ecolesData.map(ecole => ecole.type))].sort();
        const allSpecialites = ecolesData.flatMap(ecole => ecole.specialites || []);
        const specialites = [...new Set(allSpecialites)].sort();
        
        resolve({ villes, types, specialites });
      }, 300);
    });
  }
};