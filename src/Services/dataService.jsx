// Import your JSON data
import schoolsData from '../data/schools.json';

// Get all schools
export const getAllSchools = () => {
  return schoolsData;
};

// Get a single school by ID
export const getSchoolById = (id) => {
  return schoolsData.find(school => school.idEcole === id);
};

// Get schools by city
export const getSchoolsByCity = (city) => {
  return schoolsData.filter(school => 
    school.ville.toLowerCase() === city.toLowerCase()
  );
};

// Get schools by type
export const getSchoolsByType = (type) => {
  return schoolsData.filter(school => 
    school.type.toLowerCase().includes(type.toLowerCase())
  );
};

// Search schools by name or specialty
export const searchSchools = (query) => {
  const searchTerm = query.toLowerCase();
  return schoolsData.filter(school => 
    school.nom.toLowerCase().includes(searchTerm) ||
    school.specialites.some(specialite => 
      specialite.toLowerCase().includes(searchTerm)
    ) ||
    school.description.toLowerCase().includes(searchTerm)
  );
};

// Get schools sorted by rating (highest first)
export const getTopRatedSchools = (limit = 5) => {
  return [...schoolsData]
    .sort((a, b) => b.note - a.note)
    .slice(0, limit);
};

// Get all unique cities
export const getAllCities = () => {
  const cities = schoolsData.map(school => school.ville);
  return [...new Set(cities)]; // Remove duplicates
};

// Get all unique school types
export const getAllSchoolTypes = () => {
  const types = schoolsData.map(school => school.type);
  return [...new Set(types)]; // Remove duplicates
};

// Get schools with price range
export const getSchoolsByPriceRange = (min = 0, max = Infinity) => {
  return schoolsData.filter(school => {
    const price = parseInt(school.cout.replace(/\D/g, '')); // Extract numbers only
    return price >= min && price <= max;
  });
};

// Export the data directly if needed
export const schools = schoolsData;