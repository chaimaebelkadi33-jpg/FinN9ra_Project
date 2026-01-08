// src/Services/dataService.js
import ecolesData from '../Data/ecoles.json';

export const dataService = {
  // Get all schools
  getAllEcoles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ecolesData);
      }, 500); // Simulate API delay
    });
  },

  // Get school by ID
  getEcoleById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ecole = ecolesData.find(item => item.id === parseInt(id));
        if (ecole) {
          resolve(ecole);
        } else {
          reject(new Error('École non trouvée'));
        }
      }, 300);
    });
  },

  // Search schools by name or location
  searchEcoles: (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = ecolesData.filter(ecole => 
          ecole.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ecole.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ecole.adresse.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(results);
      }, 400);
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
        
        // Add more filters as needed
        resolve(results);
      }, 400);
    });
  }
};
