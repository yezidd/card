-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-05-02 18:31:16
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
  `pointCollege` int(11) NOT NULL COMMENT '目标学院',
  `pointClass` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标班级',
  `isFinish` tinyint(1) NOT NULL DEFAULT '0' COMMENT '活动是否结束'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cActivity`
--

INSERT INTO `cActivity` (`id`, `title`, `typeId`, `reward`, `rewardMark`, `location`, `locationId`, `isCheck`, `distance`, `startTime`, `endTime`, `createdTime`, `updatedTime`, `isNeedCheck`, `isActive`, `personNum`, `signNum`, `mess`, `pointCollege`, `pointClass`, `isFinish`) VALUES
(23, '杭州市三医院', 1, 14, '创新分', '你好啊', '{\"lon\":\"120.184431\",\"lat\":\"30.252075\"}', 0, 2, '2018-04-24T07:41:30.708Z', '2018-04-23T16:00:00.000Z', '2018-04-24 07:41:56', '2018-04-24 10:03:59', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"\"}]', 1, 23, 0, '213123', 0, '', 0),
(24, '1', 1, 13, '工时', '23', '{\"lon\":\"120.184431\",\"lat\":\"30.252075\"}', 0, 2, '2018-04-17T16:00:00.000Z', '2018-04-25T16:00:00.000Z', '2018-04-24 07:44:37', '2018-04-24 16:30:58', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"\"},{\"key\":2,\"name\":\"身份证\",\"value\":\"\"}]', 1, 10, 1, '213123213', 0, '', 0),
(25, '杭州市三医院', 1, 0, '创新分', '文三路', '{\"lon\":\"120\",\"lat\":\"231\"}', 0, 22, '2018-04-26T16:00:00.000Z', '2018-04-24T16:00:00.000Z', '2018-04-26 06:39:09', '2018-04-26 11:37:34', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"\"},{\"key\":1,\"name\":\"身份证号\",\"value\":\"\"}]', 1, 20, 0, '你好中国', 0, '', 0),
(26, '杭州十三医院2', 1, 2, '创新分', 'long', '{\"lon\":\"120.184431\",\"lat\":\"30.252075\"}', 0, 2222, '2018-04-26T06:44:30.422Z', '2018-04-27T16:00:00.000Z', '2018-04-26 06:44:56', '2018-05-01 08:46:43', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"\"},{\"key\":1,\"name\":\"111\",\"value\":\"\"}]', 1, 23, 1, '233', 1, '[31,32,33]', 1);

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

--
-- 转存表中的数据 `cCardRecord`
--

INSERT INTO `cCardRecord` (`id`, `uuid`, `open_id`, `distance`, `checkFlag`, `time`, `workId`) VALUES
(1, 'd3911181-2db8-4f09-9cf2-b3501409fee9', 'oHzQa0WbW-5PvasllOi68SPIUceI', 8949.45, 1, '2018-05-01 05:59:18', 11);

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
(31, '软工1405', 1, 1),
(32, '软工1404', 1, 1),
(33, '软工1403', 1, 1),
(34, '软工1402', 1, 0),
(35, '软工1401', 1, 0),
(36, '政管1401', 1, 9),
(37, '政管1402', 1, 9),
(38, '政管1403', 1, 9),
(39, '博士研究所', 1, 8);

-- --------------------------------------------------------

--
-- 表的结构 `cCollege`
--

CREATE TABLE `cCollege` (
  `id` int(11) NOT NULL,
  `collegeName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cCollege`
--

INSERT INTO `cCollege` (`id`, `collegeName`, `isActive`) VALUES
(1, '计算机学院', 1),
(2, '政管学院', 1);

-- --------------------------------------------------------

--
-- 表的结构 `cGrade`
--

CREATE TABLE `cGrade` (
  `id` int(11) NOT NULL,
  `gradeName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `cid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cGrade`
--

INSERT INTO `cGrade` (`id`, `gradeName`, `isActive`, `cid`) VALUES
(1, '大一', 1, 1),
(2, '大二', 1, 1),
(3, '大三', 1, 1),
(4, '大四', 1, 1),
(5, '研一', 1, 1),
(6, '研二', 1, 1),
(7, '研三', 1, 1),
(8, '博一', 1, 1),
(9, '大一', 1, 2);

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
('oHzQa0WbW-5PvasllOi68SPIUceI', 'bae534b6-715a-4497-95b3-d65740cb6cc3', 'f6bf4a97df6167f3a9da7477521eda82953cbe7e', '2018-05-02 08:05:34', '2018-05-02 08:05:34', '0YXBZScF0SuXgzjpktY4zQ==', '{\"openId\":\"oHzQa0WbW-5PvasllOi68SPIUceI\",\"nickName\":\"幽海\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Taizhou\",\"province\":\"Zhejiang\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Apo1wlAHB27J7OVVYpEicweWHKicr6PPQic95gzRdib6rcbic6qBbviadl7mia8vFZYq4Pdxe42fIDZAUZ4BUnkIwQiajA/0\",\"watermark\":{\"timestamp\":1525248331,\"appid\":\"wx438087004b83c83d\"}}');

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
  `studentId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '手机号可以不填，根据需求来',
  `signCheck` tinyint(1) NOT NULL DEFAULT '0',
  `feedbackMess` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedbackFlag` tinyint(1) NOT NULL DEFAULT '0',
  `checkTime` datetime NOT NULL,
  `feedTime` datetime NOT NULL,
  `needCheckData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `cSign`
--

INSERT INTO `cSign` (`id`, `uuid`, `open_id`, `activityId`, `createTime`, `studentId`, `phone`, `signCheck`, `feedbackMess`, `feedbackFlag`, `checkTime`, `feedTime`, `needCheckData`) VALUES
(30, '1aea1b50-4f17-42bd-b146-83ee1618d976', 'oHzQa0WbW-5PvasllOi68SPIUceI', 24, '2018-04-25 00:30:58', '201426811223', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"17816890887\"},{\"key\":2,\"name\":\"身份证\",\"value\":\"331022199701280014\"}]', 0, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"17816890888\"},{\"key\":2,\"name\":\"身份证\",\"value\":\"331022199701280014\"}]'),
(31, '1aea1b50-4f17-42bd-b146-83ee1618d976', 'oHzQa0WbW-5PvasllOi68SPIUceI', 26, '2018-04-26 19:17:11', '201426811223', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"17816890887\"},{\"key\":1,\"name\":\"111\",\"value\":\"112233\"}]', 1, '真的好棒啊活动', 1, '2018-04-26 19:37:17', '2018-04-26 19:52:37', '[{\"key\":1,\"name\":\"手机号\",\"value\":\"17816890887\"},{\"key\":1,\"name\":\"111\",\"value\":\"112233\"}]');

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

--
-- 转存表中的数据 `cStudentInfo`
--

INSERT INTO `cStudentInfo` (`id`, `uuid`, `open_id`, `name`, `classId`, `studentId`) VALUES
(24, 'd3911181-2db8-4f09-9cf2-b3501409fee9', 'oHzQa0WbW-5PvasllOi68SPIUceI', '叶家盛', 31, '201426811223');

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
(11, '13:10:00', 7200000, '夜归打卡', '。。。', 20000, 1);

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
-- Indexes for table `cCollege`
--
ALTER TABLE `cCollege`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- 使用表AUTO_INCREMENT `cCardRecord`
--
ALTER TABLE `cCardRecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `cClass`
--
ALTER TABLE `cClass`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- 使用表AUTO_INCREMENT `cCollege`
--
ALTER TABLE `cCollege`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `cGrade`
--
ALTER TABLE `cGrade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用表AUTO_INCREMENT `cSign`
--
ALTER TABLE `cSign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- 使用表AUTO_INCREMENT `cStudentInfo`
--
ALTER TABLE `cStudentInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
