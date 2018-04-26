-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-04-23 14:56:20
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
-- 表的结构 `cActivity`
--

CREATE TABLE `cActivity` (
  `id` int(11) NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeId` int(11) NOT NULL,
  `reward` int(11) NOT NULL,
  `rewardMark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `locationId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCheck` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要签到',
  `distance` int(11) NOT NULL,
  `startTime` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isNeedCheck` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '本次活动需要提交的东西',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `personNum` int(11) NOT NULL,
  `signNum` int(11) NOT NULL DEFAULT '0',
  `mess` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isFinish` tinyint(1) NOT NULL DEFAULT '0' COMMENT '活动是否结束',
  `forCid` int(11) NOT NULL COMMENT '0表示所有的班级',
  `forGid` int(11) NOT NULL COMMENT '0表示所有年级'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cActivity`
--

INSERT INTO `cActivity` (`id`, `title`, `typeId`, `reward`, `rewardMark`, `location`, `locationId`, `isCheck`, `distance`, `startTime`, `endTime`, `createdTime`, `updatedTime`, `isNeedCheck`, `isActive`, `personNum`, `signNum`, `mess`, `isFinish`, `forCid`, `forGid`) VALUES
(20, '杭州市三医院', 2, 3, '创新分', '杭州市三医院', '{\"lon\":\"120.13025\",\"lat\":\"30.2596\"}', 0, 6, '2018-04-21 18:58:48', '2018-04-29', '2018-04-21 10:58:48', '2018-04-22 08:28:38', '{}', 1, 10, 1, '你好中国', 1, 0, 0),
(21, '科普讲座', 2, 0, '创新分', '32423', '{\"lon\":\"120.13025\",\"lat\":\"30.2596\"}', 1, 23, '2018-04-21T11:57:57.899Z', '2018-04-25T16:00:00.000Z', '2018-04-21 11:59:23', '2018-04-22 03:19:55', '{}', 1, 0, 1, '', 0, 0, 0),
(22, '杭州市三医院讲座', 2, 0, '工时', '杭州市三医院', '{\"lon\":\"120.184431\",\"lat\":\"30.252075\"}', 0, 2, '2018-04-26T02:00:00.000Z', '2018-04-24T16:00:00.000Z', '2018-04-23 06:46:00', '2018-04-23 06:46:00', '{\"checkPhone\":true}', 1, 0, 0, '21423543543', 0, 0, 0);

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
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `gid` int(11) NOT NULL COMMENT '对应年级用的'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cClass`
--

INSERT INTO `cClass` (`id`, `className`, `isActive`, `gid`) VALUES
(31, '1', 0, 0),
(32, '2', 0, 0),
(33, '3', 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `cGrade`
--

CREATE TABLE `cGrade` (
  `id` int(11) NOT NULL,
  `gradeName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
('oHzQa0WbW-5PvasllOi68SPIUceI', '88527393-9bf9-4fbd-990d-2f4faf7c9b98', 'b74c1c26a609f56a0855279ae00811d18ee10241', '2018-04-23 12:35:29', '2018-04-23 12:35:29', 'umADONWqBDvUSGF4azsdrQ==', '{\"openId\":\"oHzQa0WbW-5PvasllOi68SPIUceI\",\"nickName\":\"幽海\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Taizhou\",\"province\":\"Zhejiang\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Apo1wlAHB27J7OVVYpEicweWHKicr6PPQic95gzRdib6rcbic6qBbviadl7mia8vFZYq4Pdxe42fIDZAUZ4BUnkIwQiajA/0\",\"watermark\":{\"timestamp\":1524486926,\"appid\":\"wx438087004b83c83d\"}}');

-- --------------------------------------------------------

--
-- 表的结构 `cSign`
--

CREATE TABLE `cSign` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activityId` int(11) NOT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `studentId` int(11) NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '手机号可以不填，根据需求来',
  `signCheck` tinyint(1) NOT NULL DEFAULT '0',
  `feedbackMess` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedbackFlag` tinyint(1) NOT NULL DEFAULT '0',
  `checkTime` datetime NOT NULL,
  `feedTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cSign`
--

INSERT INTO `cSign` (`id`, `uuid`, `open_id`, `activityId`, `createTime`, `studentId`, `phone`, `signCheck`, `feedbackMess`, `feedbackFlag`, `checkTime`, `feedTime`) VALUES
(21, 'fb63cef9-d664-497e-8664-d2097f4eef15', 'oHzQa0WbW-5PvasllOi68SPIUceI', 20, '2018-04-21 19:54:44', 2147483647, '17816890887', 1, '314242342354353', 1, '2018-04-21 20:15:40', '2018-04-22 14:04:47'),
(22, 'fb63cef9-d664-497e-8664-d2097f4eef15', 'oHzQa0WbW-5PvasllOi68SPIUceI', 21, '2018-04-21 20:01:07', 2147483647, '0', 1, '', 0, '2018-04-22 11:20:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `cStudentInfo`
--

CREATE TABLE `cStudentInfo` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `classId` int(11) NOT NULL,
  `studentId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `cType`
--

CREATE TABLE `cType` (
  `id` int(11) NOT NULL,
  `typeName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cType`
--

INSERT INTO `cType` (`id`, `typeName`, `isActive`) VALUES
(1, '医院', 1),
(2, '讲座', 1);

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
-- Indexes for table `cActivity`
--
ALTER TABLE `cActivity`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `cGrade`
--
ALTER TABLE `cGrade`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cSessionInfo`
--
ALTER TABLE `cSessionInfo`
  ADD PRIMARY KEY (`open_id`),
  ADD KEY `openid` (`open_id`) USING BTREE,
  ADD KEY `skey` (`skey`) USING BTREE;

--
-- Indexes for table `cSign`
--
ALTER TABLE `cSign`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cStudentInfo`
--
ALTER TABLE `cStudentInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cType`
--
ALTER TABLE `cType`
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
-- 使用表AUTO_INCREMENT `cActivity`
--
ALTER TABLE `cActivity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
-- 使用表AUTO_INCREMENT `cGrade`
--
ALTER TABLE `cGrade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `cSign`
--
ALTER TABLE `cSign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- 使用表AUTO_INCREMENT `cStudentInfo`
--
ALTER TABLE `cStudentInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- 使用表AUTO_INCREMENT `cType`
--
ALTER TABLE `cType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `cWork`
--
ALTER TABLE `cWork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
