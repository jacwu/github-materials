using System;
using System.Collections.Generic;

namespace CityCompositionExample
{
    public class Car
    {
        public string Model { get; set; }
        public string LicensePlate { get; set; }

        public Car(string model, string licensePlate)
        {
            Model = model;
            LicensePlate = licensePlate;
        }

        public void DisplayInfo()
        {
            Console.WriteLine($"Car: {Model}, License Plate: {LicensePlate}");
        }
    }

    public class Citizen
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public List<Car> Cars { get; set; }

        public Citizen(string name, int age)
        {
            Name = name;
            Age = age;
            Cars = new List<Car>();
        }

        public void AddCar(Car car)
        {
            Cars.Add(car);
        }

        public void DisplayCars()
        {
            Console.WriteLine($"{Name}'s Cars:");
            foreach (var car in Cars)
            {
                car.DisplayInfo();
            }
        }
    }

    public class City
    {
        public string Name { get; set; }
        public List<Citizen> Citizens { get; set; }

        public City(string name)
        {
            Name = name;
            Citizens = new List<Citizen>();
        }

        public void AddCitizen(Citizen citizen)
        {
            Citizens.Add(citizen);
        }

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