
import ecolesData from '../Data/ecoles.json';

export const dataService = {

  getAllEcoles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ecolesData);
      }, 500);
    });
  },


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

 
  searchEcoles: (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchLower = searchTerm.toLowerCase();
        
       
        const results = ecolesData.filter(ecole => 
          ecole.nom.toLowerCase().includes(searchLower)
        );
        
        resolve(results);
      }, 300);
    });
  },


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

 
  getVilles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const villes = [...new Set(ecolesData.map(ecole => ecole.ville))].sort();
        resolve(villes);
      }, 200);
    });
  },

  
  getTypes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const types = [...new Set(ecolesData.map(ecole => ecole.type))].sort();
        resolve(types);
      }, 200);
    });
  },

  
  getSpecialites: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
       
        const allSpecialites = ecolesData.flatMap(ecole => ecole.specialites || []);
        const specialites = [...new Set(allSpecialites)].sort();
        resolve(specialites);
      }, 200);
    });
  },

  
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
