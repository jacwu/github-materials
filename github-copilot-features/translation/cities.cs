using System;
using System.Collections.Generic;

namespace CityCompositionExample
{
    /// <summary>
    /// Represents a car with a model and license plate.
    /// </summary>
    public class Car
    {
        /// <summary>
        /// Gets or sets the model of the car.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the license plate of the car.
        /// </summary>
        public string LicensePlate { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Car"/> class with the specified model and license plate.
        /// </summary>
        /// <param name="model">The model of the car.</param>
        /// <param name="licensePlate">The license plate of the car.</param>
        public Car(string model, string licensePlate)
        {
            Model = model;
            LicensePlate = licensePlate;
        }

        /// <summary>
        /// Displays the car's information to the console.
        /// </summary>
        public void DisplayInfo()
        {
            Console.WriteLine($"Car: {Model}, License Plate: {LicensePlate}");
        }
    }

    /// <summary>
    /// Represents a citizen with a name, age, and a list of cars.
    /// </summary>
    public class Citizen
    {
        /// <summary>
        /// Gets or sets the name of the citizen.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the age of the citizen.
        /// </summary>
        public int Age { get; set; }

        /// <summary>
        /// Gets or sets the list of cars owned by the citizen.
        /// </summary>
        public List<Car> Cars { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Citizen"/> class with the specified name and age.
        /// </summary>
        /// <param name="name">The name of the citizen.</param>
        /// <param name="age">The age of the citizen.</param>
        public Citizen(string name, int age)
        {
            Name = name;
            Age = age;
            Cars = new List<Car>();
        }

        /// <summary>
        /// Adds a car to the citizen's list of cars.
        /// </summary>
        /// <param name="car">The car to add.</param>
        public void AddCar(Car car)
        {
            Cars.Add(car);
        }

        /// <summary>
        /// Displays the citizen's cars to the console.
        /// </summary>
        public void DisplayCars()
        {
            Console.WriteLine($"{Name}'s Cars:");
            foreach (var car in Cars)
            {
                car.DisplayInfo();
            }
        }
    }

    /// <summary>
    /// Represents a city with a name and a list of citizens.
    /// </summary>
    public class City
    {
        /// <summary>
        /// Gets or sets the name of the city.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the list of citizens in the city.
        /// </summary>
        public List<Citizen> Citizens { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="City"/> class with the specified name.
        /// </summary>
        /// <param name="name">The name of the city.</param>
        public City(string name)
        {
            Name = name;
            Citizens = new List<Citizen>();
        }

        /// <summary>
        /// Adds a citizen to the city's list of citizens.
        /// </summary>
        /// <param name="citizen">The citizen to add.</param>
        public void AddCitizen(Citizen citizen)
        {
            Citizens.Add(citizen);
        }

        /// <summary>
        /// Displays the city's information, including its citizens and their cars, to the console.
        /// </summary>
        public void DisplayCityInfo()
        {
            Console.WriteLine($"City: {Name}");
            foreach (var citizen in Citizens)
            {
                Console.WriteLine($"Citizen: {citizen.Name}, Age: {citizen.Age}");
                citizen.DisplayCars();
            }
        }
    }
}