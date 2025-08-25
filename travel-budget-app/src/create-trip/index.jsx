import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function CreateTrip() {
  const [formData, setFormData] = useState({
    location: '',
    noOfDays: '',
    budget: '',
    traveler: ''
  });
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [error, setError] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('Form Data:', formData);
  }, [formData]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => {
        console.log('Raw response:', res);
        return res.json();
      })
      .then(data => {
        console.log('Countries Data:', data);
        if (Array.isArray(data)) {
          const sortedCountries = data
            .filter(c => c.name?.common)
            .sort((a, b) => a.name.common.localeCompare(b.name.common));
          setCountries(sortedCountries);
        } else {
          setError('Invalid data format');
        }
        setLoadingCountries(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Error loading countries');
        setLoadingCountries(false);
      });
  }, []);


  const OnGenerateTrip = () => {
    if (
      !formData.location ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.traveler
    ) {
      toast('Please fill all details.');
      return;
    }
    console.log('Final Trip Data:', formData);
  };

  return (
    <div className="px-60 py-20">
      <h2 className="font-bold text-3xl">Tell us your preferences ⛺</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Destination Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your choice of destination?
          </h2>
          {loadingCountries ? (
            <p>Loading countries...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <select
              className="border p-2 rounded w-full"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* No of Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning to stay?
          </h2>
          <Input
            placeholder="Ex - 3"
            type="number"
            value={formData.noOfDays}
            onChange={e => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.budget === item.title && 'shadow-lg border-black'
                }`}
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            With whom do you plan to travel?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.traveler === item.people &&
                  'shadow-lg border-black'
                }`}
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 justify-end flex">
          <Button onClick={OnGenerateTrip}>Generate Trip</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
