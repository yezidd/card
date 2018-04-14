-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-04-14 12:46:59
-- 服务器版本： 10.1.31-MariaDB
-- PHP Version: 7.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cAuth`
--

-- --------------------------------------------------------

--
-- 表的结构 `cCardRecord`
--

CREATE TABLE `cCardRecord` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance` double NOT NULL,
  `checkFlag` tinyint(1) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `workId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cClass`
--

CREATE TABLE `cClass` (
  `id` int(11) NOT NULL,
  `className` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cClass`
--

INSERT INTO `cClass` (`id`, `className`, `isActive`) VALUES
(31, '1', 0),
(32, '2', 0),
(33, '3', 1);

-- --------------------------------------------------------

--
-- 表的结构 `cSessionInfo`
--

CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

--
-- 转存表中的数据 `cSessionInfo`
--

INSERT INTO `cSessionInfo` (`open_id`, `uuid`, `skey`, `create_time`, `last_visit_time`, `session_key`, `user_info`) VALUES
('oHzQa0WbW-5PvasllOi68SPIUceI', '240a5d4e-97d8-43cd-a9b4-e59b32773b77', 'b4d95cda9273b9a0fb25c05817d6aaabdbea713b', '2018-04-11 02:17:02', '2018-04-11 02:17:02', 'uHbVoHGTz555+5KHN0f0nw==', '{\"openId\":\"oHzQa0WbW-5PvasllOi68SPIUceI\",\"nickName\":\"幽海\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Taizhou\",\"province\":\"Zhejiang\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Apo1wlAHB27J7OVVYpEicweWHKicr6PPQic95gzRdib6rcbic6qBbviadl7mia8vFZYq4Pdxe42fIDZAUZ4BUnkIwQiajA/0\",\"watermark\":{\"timestamp\":1523413020,\"appid\":\"wx438087004b83c83d\"}}');

-- --------------------------------------------------------

--
-- 表的结构 `cStudentInfo`
--

CREATE TABLE `cStudentInfo` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text,
  `classId` int(11) NOT NULL,
  `studentId` varchar(100) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cStudentInfo`
--

INSERT INTO `cStudentInfo` (`id`, `uuid`, `open_id`, `name`, `classId`, `studentId`, `count`) VALUES
(20, 'fb63cef9-d664-497e-8664-d2097f4eef15', 'oHzQa0WbW-5PvasllOi68SPIUceI', '', 33, '201426811223', 0);

-- --------------------------------------------------------

--
-- 表的结构 `cWork`
--

CREATE TABLE `cWork` (
  `id` int(11) NOT NULL,
  `startTime` time NOT NULL,
  `timeLong` int(11) NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mess` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cWork`
--

INSERT INTO `cWork` (`id`, `startTime`, `timeLong`, `title`, `mess`, `distance`, `isActive`) VALUES
(1, '15:24:29', 100000, '夜归打卡', '请准时打卡', 100000, 0),
(6, '16:31:00', 7200000, '3', '3', 34000000, 0),
(7, '17:29:00', 7200000, '5', '5', 2000000, 0),
(8, '17:32:00', 7200000, '6', '6', 12000, 0),
(9, '16:33:00', 7200000, '234', '234', 2000, 0),
(10, '16:35:00', 3600000, '23', '231', 23000, 0),
(11, '14:10:00', 7200000, '夜归打卡', '。。。', 2000, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cCardRecord`
--
ALTER TABLE `cCardRecord`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cClass`
--
ALTER TABLE `cClass`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cSessionInfo`
--
ALTER TABLE `cSessionInfo`
  ADD PRIMARY KEY (`open_id`),
  ADD KEY `openid` (`open_id`) USING BTREE,
  ADD KEY `skey` (`skey`) USING BTREE;

--
-- Indexes for table `cStudentInfo`
--
ALTER TABLE `cStudentInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cWork`
--
ALTER TABLE `cWork`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `cCardRecord`
--
ALTER TABLE `cCardRecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `cClass`
--
ALTER TABLE `cClass`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- 使用表AUTO_INCREMENT `cStudentInfo`
--
ALTER TABLE `cStudentInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- 使用表AUTO_INCREMENT `cWork`
--
ALTER TABLE `cWork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
