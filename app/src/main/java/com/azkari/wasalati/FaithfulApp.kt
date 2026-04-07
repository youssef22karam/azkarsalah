package com.azkari.wasalati

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountBalance
import androidx.compose.material.icons.rounded.Download
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material.icons.rounded.Notifications
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.Tune
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.Calendar

@Composable
fun AzkariFaithfulApp(
    viewModel: FaithfulMainViewModel,
    notificationPermissionGranted: Boolean,
    exactAlarmPermissionGranted: Boolean,
    onRequestNotifications: () -> Unit,
    onRequestExactAlarms: () -> Unit,
    onUseCurrentLocation: () -> Unit,
) {
    val uiState = viewModel.uiState

    AzkariFaithfulTheme {
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.radialGradient(
                            colors = listOf(ForestLight.copy(alpha = 0.08f), Cream),
                            radius = 1400f,
                        ),
                    )
                    .testTag("app_root"),
            ) {
                Scaffold(
                    containerColor = Color.Transparent,
                    topBar = {
                        AppHeader(
                            uiState = uiState,
                            onOpenSettings = { viewModel.openModal(AppModal.SETTINGS) },
                            onOpenQada = { viewModel.openModal(AppModal.QADA) },
                            onOpenCity = { viewModel.openModal(AppModal.CITY) },
                        )
                    },
                ) { padding ->
                    if (uiState.isLoading) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(padding),
                            contentAlignment = Alignment.Center,
                        ) {
                            CircularProgressIndicator(color = Forest)
                        }
                    } else {
                        HomeContent(
                            modifier = Modifier.padding(padding),
                            uiState = uiState,
                            viewModel = viewModel,
                        )
                    }
                }

                if (uiState.isOffline) {
                    OfflineBanner(Modifier.align(Alignment.TopCenter).padding(top = 92.dp))
                }

                uiState.currentToast?.let { toast ->
                    ToastCard(
                        message = toast.message,
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(16.dp)
                            .testTag("toast_card"),
                    )
                }

                FaithfulModalHost(
                    uiState = uiState,
                    viewModel = viewModel,
                    notificationPermissionGranted = notificationPermissionGranted,
                    exactAlarmPermissionGranted = exactAlarmPermissionGranted,
                    onRequestNotifications = onRequestNotifications,
                    onRequestExactAlarms = onRequestExactAlarms,
                    onUseCurrentLocation = onUseCurrentLocation,
                )
            }
        }
    }
}

@Composable
private fun AppHeader(
    uiState: AppUiState2,
    onOpenSettings: () -> Unit,
    onOpenQada: () -> Unit,
    onOpenCity: () -> Unit,
) {
    Surface(
        color = Color.White.copy(alpha = 0.96f),
        shadowElevation = 8.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BrandMark()
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text("أذكاري وصلاتي", fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
                Text(
                    text = uiState.hijriDate,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            CircleIconButton(onClick = onOpenSettings, icon = Icons.Rounded.Tune, tag = "settings_button")
            Spacer(Modifier.width(8.dp))
            Box {
                CircleIconButton(onClick = onOpenQada, icon = Icons.Rounded.AccountBalance, tint = Color(0xFFE11D48), tag = "qada_button")
                if (uiState.qada.values.sum() > 0) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .clip(CircleShape)
                            .background(Color(0xFFE11D48))
                            .padding(horizontal = 6.dp, vertical = 2.dp),
                    ) {
                        Text(uiState.qada.values.sum().toString(), color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(Modifier.width(8.dp))
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = Color(0xFFFFF5F5),
                modifier = Modifier.clickable(onClick = onOpenCity),
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = Color(0xFFF87171), modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = uiState.currentCity?.name ?: "اختر مدينة",
                        fontSize = 12.sp,
                        maxLines = 1,
                    )
                }
            }
        }
    }
}

@Composable
private fun BrandMark() {
    Box(
        modifier = Modifier
            .size(40.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(Brush.linearGradient(listOf(ForestDark, Forest))),
        contentAlignment = Alignment.Center,
    ) {
        Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Color.White, modifier = Modifier.size(22.dp))
    }
}

@Composable
private fun CircleIconButton(
    onClick: () -> Unit,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    tint: Color = Forest,
    tag: String,
) {
    Surface(
        shape = CircleShape,
        color = Color(0xFFF5F5F4),
        modifier = Modifier.testTag(tag),
    ) {
        IconButton(onClick = onClick) {
            Icon(icon, contentDescription = null, tint = tint)
        }
    }
}

@Composable
private fun HomeContent(
    modifier: Modifier,
    uiState: AppUiState2,
    viewModel: FaithfulMainViewModel,
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("home_list"),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            if (uiState.currentCity == null || uiState.currentPrayerTimes == null || uiState.prayerSummary == null) {
                EmptyCityCard(onOpenCity = { viewModel.openModal(AppModal.CITY) })
            } else {
                PrayerBanner(uiState = uiState, onToggle = viewModel::toggleBanner, onOpenTracker = { viewModel.openModal(AppModal.TRACKER) })
            }
        }

        item {
            QuranEntryCard(onOpenQuran = viewModel::openQuran)
        }

        if (uiState.quran.dailyGoal > 0) {
            item {
                QuranDailyTrackerCard(uiState.quran)
            }
        }

        item {
            TabStrip(selected = uiState.selectedTab, onSelect = { viewModel.selectTab(it) })
        }

        uiState.suggestion?.let { suggestion ->
            item {
                FaithfulSuggestionCard(
                    suggestion = suggestion,
                    onReset = viewModel::resetAutoTab,
                )
            }
        }

        if (Calendar.getInstance().get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY) {
            item {
                FridayKahfCard(onOpen = viewModel::openSurahKahf)
            }
        }

        if (uiState.homeSections.isEmpty()) {
            item {
                EmptyStateCard()
            }
        } else {
            uiState.homeSections.forEach { section ->
                if (section.title != null) {
                    item(key = "${section.id}_divider") {
                        SectionDivider(section)
                    }
                }
                section.items.forEachIndexed { index, item ->
                    item(key = "${section.id}_$index") {
                        AzkarItemCard(
                            section = section,
                            index = index,
                            item = item,
                            remaining = viewModel.itemRemaining["${section.id}:$index"] ?: item.count,
                            onCount = { viewModel.decrementAzkar(section.id, index, item.count) },
                        )
                    }
                }
            }
        }

        item {
            Text(
                text = "﷽ — صدقة جارية للحاج ماهر كرم وجميع أموات المسلمين رحمهم الله",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
            )
        }
    }
}

@Composable
private fun EmptyCityCard(onOpenCity: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(28.dp),
        color = MaterialTheme.colorScheme.surface,
        modifier = Modifier.fillMaxWidth().testTag("home_empty_state"),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = Forest, modifier = Modifier.size(42.dp))
            Spacer(Modifier.height(10.dp))
            Text("ابدأ باختيار مدينتك", fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                "اختر مدينتك لعرض مواقيت الصلاة والأذكار المناسبة.",
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(14.dp))
            OutlinedButton(onClick = onOpenCity) {
                Icon(Icons.Rounded.LocationOn, contentDescription = null)
                Spacer(Modifier.width(6.dp))
                Text("اختيار مدينة")
            }
        }
    }
}

@Composable
private fun PrayerBanner(
    uiState: AppUiState2,
    onToggle: () -> Unit,
    onOpenTracker: () -> Unit,
) {
    val summary = uiState.prayerSummary ?: return
    val currentCity = uiState.currentCity ?: return
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize()
            .testTag("prayer_banner"),
        shape = RoundedCornerShape(if (uiState.bannerCollapsed) 32.dp else 28.dp),
        color = Color.Transparent,
        shadowElevation = if (uiState.bannerCollapsed) 4.dp else 12.dp,
    ) {
        Box(
            modifier = Modifier
                .background(Brush.linearGradient(listOf(Color(0xFF0A1628), ForestDark, Forest)))
                .padding(16.dp),
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onToggle),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("${currentCity.name} • ${currentCity.country}", color = Color.White.copy(alpha = 0.84f), style = MaterialTheme.typography.labelLarge)
                        Text("الصلاة القادمة: ${summary.nextPrayer.displayName()}", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
                        Text(formatCountdown(summary.countdownMillis), color = GoldLight, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
                    }
                    PrayerDotsRow(uiState.prayerDots)
                }

                AnimatedVisibility(!uiState.bannerCollapsed) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        SunnahStrip(summary.sunnahInfo)
                        PrayerGrid(uiState.prayerDots)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                text = "${uiState.todayDoneCount}/5 اليوم",
                                color = Color.White.copy(alpha = 0.72f),
                                style = MaterialTheme.typography.labelMedium,
                            )
                            Spacer(Modifier.width(10.dp))
                            if (uiState.streakDays >= 2) {
                                Text("🔥 ${uiState.streakDays}", color = GoldLight, style = MaterialTheme.typography.labelLarge)
                            }
                            Spacer(Modifier.weight(1f))
                            OutlinedButton(onClick = onOpenTracker) {
                                Text("متابعة الصلوات", color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PrayerDotsRow(dots: List<PrayerDotUi>) {
    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        dots.forEach { dot ->
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(
                        when (dot.status) {
                            PrayerDotStatus.DONE -> ForestLight
                            PrayerDotStatus.MISSED -> Color(0xFFF43F5E)
                            PrayerDotStatus.UPCOMING -> Color.White.copy(alpha = 0.9f)
                            PrayerDotStatus.PENDING -> Color.White.copy(alpha = 0.24f)
                        },
                    ),
            )
        }
    }
}

@Composable
private fun SunnahStrip(sunnahInfo: SunnahInfo) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = Color.White.copy(alpha = 0.08f),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("قبل", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                Text(sunnahInfo.pre, color = Color.White, textAlign = TextAlign.Center, fontSize = 12.sp)
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("بعد", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                Text(sunnahInfo.post, color = Color.White, textAlign = TextAlign.Center, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun PrayerGrid(dots: List<PrayerDotUi>) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        dots.forEach { item ->
            Surface(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                color = Color.White.copy(alpha = 0.08f),
            ) {
                Column(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(item.label, color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                    Text(item.timeLabel, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(Modifier.height(6.dp))
                    PrayerDotsRow(listOf(item))
                }
            }
        }
    }
}

@Composable
private fun QuranEntryCard(onOpenQuran: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = Color.Transparent,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onOpenQuran)
            .testTag("quran_entry_card"),
    ) {
        Row(
            modifier = Modifier
                .background(
                    Brush.linearGradient(
                        listOf(GoldLight.copy(alpha = 0.6f), Color.White.copy(alpha = 0.95f)),
                    ),
                )
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color.White.copy(alpha = 0.84f)),
                contentAlignment = Alignment.Center,
            ) {
                Text("📖", fontSize = 18.sp)
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "القرآن الكريم",
                    style = TextStyle(fontFamily = AmiriFamily, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = AmberText),
                )
                Text("قراءة واستماع", color = AmberText.copy(alpha = 0.75f), style = MaterialTheme.typography.labelMedium)
            }
            Icon(Icons.Rounded.Download, contentDescription = null, tint = Gold)
        }
    }
}

@Composable
private fun QuranDailyTrackerCard(quranUiState: QuranUiState) {
    val goal = quranUiState.dailyGoal.coerceAtLeast(1)
    val progress = (quranUiState.dailyLog.pagesRead.size.toFloat() / goal).coerceIn(0f, 1f)
    Surface(
        shape = RoundedCornerShape(22.dp),
        color = Color.White,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("📖", fontSize = 14.sp)
            Spacer(Modifier.width(8.dp))
            Text("وِردك اليومي", modifier = Modifier.weight(1f), color = AmberText)
            Text(
                text = "${quranUiState.dailyLog.pagesRead.size}/${quranUiState.dailyGoal}",
                fontWeight = FontWeight.Bold,
                color = Gold,
            )
        }
        Box(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(999.dp))
                .background(GoldLight),
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(progress)
                    .height(6.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Brush.horizontalGradient(listOf(GoldBright, Gold))),
            )
        }
        if (quranUiState.stats.streakDays >= 2) {
            Text(
                text = "🔥 ${quranUiState.stats.streakDays}",
                color = Gold,
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
            )
        } else {
            Spacer(Modifier.height(12.dp))
        }
    }
}

@Composable
private fun TabStrip(selected: HomeTab, onSelect: (HomeTab) -> Unit) {
    val scrollState = rememberScrollState()
    Row(
        modifier = Modifier
            .horizontalScroll(scrollState)
            .testTag("tab_strip"),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        HomeTab.entries.filter { it != HomeTab.FRIDAY || Calendar.getInstance().get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY }
            .forEach { tab ->
                FilterChip(
                    selected = selected == tab,
                    onClick = { onSelect(tab) },
                    label = { Text(tab.chipLabel) },
                )
            }
    }
}

@Composable
private fun FaithfulSuggestionCard(
    suggestion: String,
    onReset: () -> Unit,
) {
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = Color(0xFFEAFBF4),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("💡", fontSize = 16.sp)
            Spacer(Modifier.width(8.dp))
            Text(suggestion, modifier = Modifier.weight(1f), color = ForestDark)
            OutlinedButton(onClick = onReset) {
                Text("تلقائي")
            }
        }
    }
}

@Composable
private fun FridayKahfCard(onOpen: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(22.dp),
        color = Color.Transparent,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .background(Brush.linearGradient(listOf(Color(0xFF422006), Color(0xFF92400E))))
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0x33FBBF24)),
                contentAlignment = Alignment.Center,
            ) {
                Text("🕌", fontSize = 18.sp)
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text("يوم الجمعة المبارك", color = Color(0xFFFBBF24), fontWeight = FontWeight.ExtraBold)
                Text("اقرأ سورة الكهف وأكثر من الصلاة على النبي ﷺ", color = Color(0xFFFDE68A), fontSize = 11.sp)
            }
            OutlinedButton(onClick = onOpen) {
                Text("اقرأ الكهف", color = Color(0xFFFBBF24))
            }
        }
    }
}

@Composable
private fun SectionDivider(section: AzkarSection) {
    val colors = when (section.palette) {
        SectionPalette.WAKING -> listOf(Forest, Color(0xFF047857))
        SectionPalette.MORNING -> listOf(Color(0xFF0F766E), Color(0xFF0D9488))
        SectionPalette.DUHA -> listOf(Color(0xFFB45309), Color(0xFFD97706))
        SectionPalette.EVENING -> listOf(Color(0xFF1E3A5F), Color(0xFF1E40AF))
        SectionPalette.SLEEP -> listOf(Color(0xFF2D1B69), Color(0xFF4C1D95))
        SectionPalette.TAHAJJUD -> listOf(Color(0xFF1E1B4B), Color(0xFF312E81))
        SectionPalette.FRIDAY -> listOf(Color(0xFF854D0E), Color(0xFF92400E))
        SectionPalette.PRAYER -> listOf(ForestDark, Forest)
        SectionPalette.PLAIN -> listOf(Forest, ForestMid)
    }
    Surface(shape = RoundedCornerShape(20.dp), color = Color.Transparent) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.linearGradient(colors))
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White.copy(alpha = 0.16f)),
                contentAlignment = Alignment.Center,
            ) {
                Text(section.icon.orEmpty())
            }
            Spacer(Modifier.width(10.dp))
            Column {
                Text(section.title.orEmpty(), color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                section.subtitle?.let {
                    Text(it, color = Color.White.copy(alpha = 0.7f), fontSize = 10.sp)
                }
            }
        }
    }
}

@Composable
private fun AzkarItemCard(
    section: AzkarSection,
    index: Int,
    item: AzkarItem,
    remaining: Int,
    onCount: () -> Unit,
) {
    Surface(
        shape = RoundedCornerShape(28.dp),
        color = Color.White.copy(alpha = 0.86f),
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
            .testTag("azkar_card_${section.id}_$index"),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .animateContentSize()
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                item.title?.let {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Sage,
                    ) {
                        Text(
                            text = it,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            color = Forest,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                        )
                    }
                    Spacer(Modifier.width(8.dp))
                }
                Spacer(Modifier.weight(1f))
                CountBubble(remaining = remaining, total = item.count, onCount = onCount)
            }

            Text(
                text = item.text,
                style = if (item.isQuran) {
                    TextStyle(fontFamily = AmiriFamily, fontSize = 23.sp, lineHeight = 48.sp, color = ForestDark)
                } else {
                    MaterialTheme.typography.bodyLarge.copy(color = Color(0xFF1F2937))
                },
            )

            item.fadl?.let {
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = GoldLight.copy(alpha = 0.45f),
                ) {
                    Text(
                        text = "فضل: $it",
                        modifier = Modifier.padding(12.dp),
                        color = Color(0xFF92400E),
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }
        }
    }
}

@Composable
private fun CountBubble(
    remaining: Int,
    total: Int,
    onCount: () -> Unit,
) {
    val progress = if (total <= 0) 1f else 1f - (remaining.toFloat() / total.toFloat())
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = if (remaining == 0) Forest else SurfaceSoft,
        modifier = Modifier.clickable(enabled = remaining > 0, onClick = onCount),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = if (remaining == 0) "اكتمل" else remaining.toString(),
                color = if (remaining == 0) Color.White else Forest,
                fontWeight = FontWeight.ExtraBold,
            )
            if (total > 1) {
                Spacer(Modifier.width(6.dp))
                Text(
                    text = "/$total",
                    color = if (remaining == 0) Color.White.copy(alpha = 0.75f) else MaterialTheme.colorScheme.onSurfaceVariant,
                    style = MaterialTheme.typography.labelMedium,
                )
            }
            Spacer(Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .width(38.dp)
                    .height(4.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Color.White.copy(alpha = if (remaining == 0) 0.3f else 1f)),
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(progress)
                        .height(4.dp)
                        .background(if (remaining == 0) GoldLight else Forest),
                )
            }
        }
    }
}

@Composable
private fun EmptyStateCard() {
    Surface(shape = RoundedCornerShape(24.dp), color = MaterialTheme.colorScheme.surface) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(26.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Color(0xFFD6D3D1), modifier = Modifier.size(52.dp))
            Spacer(Modifier.height(10.dp))
            Text("لا توجد عناصر لعرضها الآن", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun OfflineBanner(modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(999.dp),
        color = ForestDark,
        shadowElevation = 8.dp,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(Icons.Rounded.Notifications, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(6.dp))
            Text("وضع عدم الاتصال — التطبيق يعمل بالكامل", color = Color.White, style = MaterialTheme.typography.labelLarge)
        }
    }
}

@Composable
private fun ToastCard(
    message: String,
    modifier: Modifier = Modifier,
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        shadowElevation = 12.dp,
        color = ForestDark,
    ) {
        Text(
            text = message,
            color = Color.White,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            style = MaterialTheme.typography.bodyMedium,
        )
    }
}

private fun formatCountdown(millis: Long): String {
    val totalSeconds = (millis / 1000L).coerceAtLeast(0L)
    val hours = totalSeconds / 3600
    val minutes = (totalSeconds % 3600) / 60
    val seconds = totalSeconds % 60
    return "%02d:%02d:%02d".format(hours, minutes, seconds)
}
