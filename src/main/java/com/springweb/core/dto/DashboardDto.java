package com.springweb.core.dto;

import java.util.List;

public record DashboardDto(
        List<EventSummaryDto> upcomingEvents,     // sắp tới
        List<EventSummaryDto> hotEvents,          // nhiều đăng ký/like
        List<EventSummaryDto> newPostsEvents,     // có bài mới
        Integer unreadNotifications
) {}