-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 24, 2025 at 11:23 AM
-- Server version: 8.0.41-0ubuntu0.20.04.1
-- PHP Version: 8.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u_240171959_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `rid` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` enum('French','Italian','Chinese','Indian','Mexican','Others') COLLATE utf8mb4_general_ci NOT NULL,
  `Cookingtime` int DEFAULT NULL,
  `ingredients` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instructions` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uid` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`rid`, `name`, `description`, `type`, `Cookingtime`, `ingredients`, `instructions`, `image`, `uid`) VALUES
(6, 'Pizza (Test Recipe 1)', 'This is the description of pizza - It is a traditional and well known dish across Italy, with cheese that melts in your mouth and dough as soft as clouds, a perfect meal for 2', 'Italian', 30, '500g Flour, 2 Eggs, 10 Pepperoni slices, 300g Cheese, 200g Tomato Puree', 'Mix Flour and Eggs until dough, Roll and mould dough into circle, Spread Tomato puree over it, Spread cheese over tomato puree evenly, Place Pepperoni slices across pizza, Bake for 20mins at 180c', '1745493290644.jpg', 3),
(7, 'Chicken Chow Mein (Test Recipe 2)', 'This is a test description for the Chicken Chow Mein recipe - Everyone\'s tried this dish before. Popular across China, this is the perfect recipe to cook for family, or just for yourself.', 'Chinese', 25, '250g Diced Chicken Breast, 300g Thin Wok Noodles, Few bits of Spring Onion, 3tsp Chinese Five Spice, Dash of Soy Sauce, 2tsp MsG', 'Oil up pan on medium heat, Pan-fry chicken until white, Meanwhile - Boil Noodles in hot water, Drain noodles, Mix noodles in with chicken, Throw down Spring Onion, Throw down all the spices and sauces, Stir until all mixed in, Serve', '1745493710434.jpg', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `email`) VALUES
(3, 'TestingAccount', '$2b$10$YZyKMyyQTAizsBymJI2U..RnPgkmfdJosGaczKQrk.saxsh87jv3W', 'Test@email.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `rid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
