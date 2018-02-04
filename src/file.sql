-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 04 Feb 2018 la 17:40
-- Versiune server: 5.6.38
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatbox`
--

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `chatbox_settings`
--

CREATE TABLE `chatbox_settings` (
  `title` varchar(32) NOT NULL DEFAULT 'FA Chatbox',
  `member_avatar` tinyint(1) NOT NULL DEFAULT '1',
  `show_for` int(11) NOT NULL DEFAULT '1',
  `show_chatbox` int(11) NOT NULL DEFAULT '1',
  `max_shouts` int(11) NOT NULL DEFAULT '150',
  `chat_rules` text NOT NULL,
  `staff_members` varchar(256) NOT NULL,
  `tabs` varchar(128) NOT NULL DEFAULT '[{"name": "General", "perms": "1"}, {"name": "Staff", "perms": "2"}]',
  `theme` varchar(256) NOT NULL DEFAULT 'http://www.cdn.faproject.eu/chatbox/path/theme/default.css',
  `lang` varchar(4) NOT NULL DEFAULT 'RO',
  `forum` varchar(128) DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fa_ID` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `chatbox_shouts`
--

CREATE TABLE `chatbox_shouts` (
  `row_id` bigint(200) NOT NULL,
  `row_user` varchar(48) NOT NULL,
  `row_avatar` varchar(128) NOT NULL,
  `row_msg` varchar(256) NOT NULL,
  `row_type` int(11) NOT NULL,
  `row_admin` int(11) NOT NULL,
  `row_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tab_name` varchar(32) NOT NULL,
  `forum` varchar(64) NOT NULL,
  `tab_perms` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatbox_settings`
--
ALTER TABLE `chatbox_settings`
  ADD PRIMARY KEY (`fa_ID`);

--
-- Indexes for table `chatbox_shouts`
--
ALTER TABLE `chatbox_shouts`
  ADD PRIMARY KEY (`row_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatbox_settings`
--
ALTER TABLE `chatbox_settings`
  MODIFY `fa_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT for table `chatbox_shouts`
--
ALTER TABLE `chatbox_shouts`
  MODIFY `row_id` bigint(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
