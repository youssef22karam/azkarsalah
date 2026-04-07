package com.azkari.wasalati

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Delete
import androidx.compose.material.icons.rounded.Download
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.GraphicEq
import androidx.compose.material.icons.rounded.KeyboardArrowLeft
import androidx.compose.material.icons.rounded.KeyboardArrowRight
import androidx.compose.material.icons.rounded.MenuBook
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.SkipNext
import androidx.compose.material.icons.rounded.SkipPrevious
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

@Composable
fun FaithfulQuranDialog(
    uiState: AppUiState2,
    viewModel: FaithfulMainViewModel,
) {
    Dialog(
        onDismissRequest = viewModel::dismissModal,
        properties = DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false),
    ) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = QuranInk,
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                QuranHeader(
                    quran = uiState.quran,
                    onDismiss = viewModel::dismissModal,
                    onShowSurahs = { viewModel.showQuranMode(QuranReaderMode.SURAH_LIST) },
                    onShowSettings = { viewModel.showQuranMode(QuranReaderMode.SETTINGS) },
                    onShowAchievements = { viewModel.showQuranMode(QuranReaderMode.ACHIEVEMENTS) },
                    onShowReciters = { viewModel.showQuranMode(QuranReaderMode.RECITERS) },
                )
                when (uiState.quran.mode) {
                    QuranReaderMode.DOWNLOAD -> QuranDownloadView(uiState.quran, viewModel)
                    QuranReaderMode.READER -> QuranReaderView(uiState.quran, viewModel)
                    QuranReaderMode.SURAH_LIST -> QuranSurahListView(uiState.quran, viewModel)
                    QuranReaderMode.SETTINGS -> QuranSettingsView(uiState.quran, viewModel)
                    QuranReaderMode.ACHIEVEMENTS -> QuranAchievementsView(uiState.quran, viewModel)
                    QuranReaderMode.RECITERS -> QuranRecitersView(uiState.quran, viewModel)
                }
            }
        }
    }
}

@Composable
private fun QuranHeader(
    quran: QuranUiState,
    onDismiss: () -> Unit,
    onShowSurahs: () -> Unit,
    onShowSettings: () -> Unit,
    onShowAchievements: () -> Unit,
    onShowReciters: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF0A0703))
            .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.weight(1f)) {
                QuranTopAction(icon = Icons.Rounded.MenuBook, onClick = onShowSurahs)
                QuranTopAction(icon = Icons.Rounded.GraphicEq, onClick = onShowReciters)
                QuranTopAction(icon = Icons.Rounded.Settings, onClick = onShowSettings)
                QuranTopAction(icon = Icons.Rounded.EmojiEvents, onClick = onShowAchievements)
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "الصفحة ${quran.currentPage}",
                    style = TextStyle(fontFamily = AmiriFamily, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = GoldBright),
                )
                if (quran.dailyGoal > 0) {
                    Text(
                        text = "${quran.dailyLog.pagesRead.size}/${quran.dailyGoal} اليوم",
                        color = GoldLight.copy(alpha = 0.8f),
                        style = MaterialTheme.typography.labelMedium,
                    )
                }
            }
            Spacer(Modifier.weight(1f))
            IconButton(onClick = onDismiss) {
                Icon(Icons.Rounded.Close, contentDescription = null, tint = GoldBright)
            }
        }
        if (quran.mode == QuranReaderMode.READER || quran.mode == QuranReaderMode.SURAH_LIST) {
            Spacer(Modifier.height(10.dp))
        }
    }
}

@Composable
private fun QuranTopAction(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
) {
    Surface(shape = RoundedCornerShape(12.dp), color = Color(0x22D4A853), modifier = Modifier.clickable(onClick = onClick)) {
        Icon(icon, contentDescription = null, tint = GoldBright, modifier = Modifier.padding(10.dp).size(18.dp))
    }
}

@Composable
private fun QuranDownloadView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text("📖", fontSize = 54.sp)
        Spacer(Modifier.height(16.dp))
        Text(
            "القرآن الكريم",
            style = TextStyle(fontFamily = AmiriFamily, fontWeight = FontWeight.Bold, fontSize = 34.sp, color = GoldBright),
        )
        Spacer(Modifier.height(8.dp))
        Text("حمّل نص القرآن للقراءة بدون إنترنت", color = GoldLight.copy(alpha = 0.8f))
        Spacer(Modifier.height(4.dp))
        Text("الحجم التقريبي: 3 ميجابايت", color = GoldLight.copy(alpha = 0.5f), style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(22.dp))
        OutlinedButton(onClick = viewModel::downloadQuranText, enabled = !quran.download.isDownloading) {
            Icon(Icons.Rounded.Download, contentDescription = null, tint = GoldBright)
            Spacer(Modifier.width(8.dp))
            Text(if (quran.download.isDownloading) "جاري التحميل..." else "تحميل القرآن الكريم", color = GoldBright)
        }
        Spacer(Modifier.height(14.dp))
        if (quran.download.isDownloading) {
            Text("${quran.download.current}/${quran.download.total}", color = GoldLight)
        }
        quran.download.error?.let {
            Spacer(Modifier.height(10.dp))
            Text(it, color = Color(0xFFFCA5A5))
        }
        Spacer(Modifier.height(18.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf(2, 5, 10, 20).forEach { goal ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (quran.dailyGoal == goal) GoldBright else Color(0x22D4A853),
                    modifier = Modifier.clickable { viewModel.setQuranDailyGoal(goal) },
                ) {
                    Text(
                        goal.toString(),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        color = if (quran.dailyGoal == goal) QuranInk else GoldBright,
                    )
                }
            }
        }
    }
}

@Composable
private fun QuranReaderView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    Column(modifier = Modifier.fillMaxSize()) {
        OutlinedTextField(
            value = quran.searchQuery,
            onValueChange = viewModel::updateQuranSearchQuery,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null, tint = GoldBright) },
            label = { Text("ابحث عن سورة", color = GoldLight) },
            singleLine = true,
        )
        if (quran.searchResults.isNotEmpty()) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                items(quran.searchResults) { surah ->
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFF14100A),
                        modifier = Modifier.fillMaxWidth().clickable { viewModel.jumpToSurah(surah.number) },
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(surah.number.toString(), color = GoldLight, modifier = Modifier.width(28.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(surah.name, color = GoldBright, style = TextStyle(fontFamily = AmiriFamily, fontSize = 18.sp), modifier = Modifier.weight(1f))
                            Text("${surah.ayahs} آية", color = GoldLight.copy(alpha = 0.5f), style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp),
        ) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text("الجزء ${quran.firstJuzOnPage ?: ""}", color = GoldLight.copy(alpha = 0.4f), style = MaterialTheme.typography.bodySmall)
                    Text("صفحة ${quran.currentPage}", color = GoldLight.copy(alpha = 0.4f), style = MaterialTheme.typography.bodySmall)
                }
            }
            items(quran.pageGroups) { group ->
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    if (group.ayahs.firstOrNull()?.number == 1) {
                        Text(
                            text = "سورة ${group.surahName}",
                            style = TextStyle(fontFamily = AmiriFamily, fontWeight = FontWeight.Bold, fontSize = 28.sp, color = GoldBright),
                            modifier = Modifier.fillMaxWidth(),
                            textAlign = TextAlign.Center,
                        )
                        group.basmalaText?.let {
                            Text(
                                text = it,
                                style = TextStyle(fontFamily = AmiriFamily, fontSize = 24.sp, color = GoldLight),
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                    group.ayahs.forEach { ayah ->
                        val highlighted = quran.audio.currentSurah == group.surahNum && quran.audio.currentAyahIndex + 1 == ayah.number
                        Surface(
                            shape = RoundedCornerShape(18.dp),
                            color = if (highlighted) Color(0x22D4A853) else Color.Transparent,
                        ) {
                            Text(
                                text = "${ayah.text} ﴿${ayah.number}﴾",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                style = TextStyle(fontFamily = AmiriFamily, fontSize = 24.sp, lineHeight = 44.sp, color = GoldLight),
                            )
                        }
                    }
                }
            }
        }
        QuranAudioBar(quran, viewModel)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            OutlinedButton(onClick = viewModel::prevQuranPage, modifier = Modifier.weight(1f)) {
                Icon(Icons.Rounded.KeyboardArrowRight, contentDescription = null, tint = GoldBright)
                Text("السابقة", color = GoldBright)
            }
            OutlinedButton(onClick = viewModel::markCurrentQuranPageRead, modifier = Modifier.weight(1.2f)) {
                Text("أنهيت الصفحة", color = GoldBright)
            }
            OutlinedButton(onClick = viewModel::nextQuranPage, modifier = Modifier.weight(1f)) {
                Text("التالية", color = GoldBright)
                Icon(Icons.Rounded.KeyboardArrowLeft, contentDescription = null, tint = GoldBright)
            }
        }
    }
}

@Composable
private fun QuranSurahListView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    if (quran.surahs.isEmpty()) {
        QuranEmptyState("حمّل القرآن أولًا أو انتظر تجهيز الفهرس.")
        return
    }

    Column(modifier = Modifier.fillMaxSize()) {
        quran.audio.bulkDownloadLabel?.let { StatusBanner(it) }
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            items(quran.surahs) { surah ->
                val downloaded = quran.audio.downloadedSurahs.contains(surah.number)
                val isCurrent = quran.audio.currentSurah == surah.number
                Surface(
                    shape = RoundedCornerShape(22.dp),
                    color = if (isCurrent) Color(0x22D4A853) else Color(0xFF14100A),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.jumpToSurah(surah.number) },
                ) {
                    Column(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color(0x22D4A853),
                            ) {
                                Text(
                                    text = surah.number.toString(),
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                    color = GoldBright,
                                    fontWeight = FontWeight.Bold,
                                )
                            }
                            Spacer(Modifier.width(10.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = surah.name,
                                    style = TextStyle(
                                        fontFamily = AmiriFamily,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 24.sp,
                                        color = GoldBright,
                                    ),
                                )
                                Text(
                                    text = "${surah.englishName} • ${surah.ayahs} آية • ${surahTypeLabel(surah.type)}",
                                    color = GoldLight.copy(alpha = 0.72f),
                                    style = MaterialTheme.typography.bodySmall,
                                )
                            }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = { viewModel.playSurah(surah.number) },
                                modifier = Modifier.weight(1f),
                            ) {
                                Icon(Icons.Rounded.PlayArrow, contentDescription = null, tint = GoldBright)
                                Spacer(Modifier.width(6.dp))
                                Text("استماع", color = GoldBright)
                            }
                            OutlinedButton(
                                onClick = {
                                    if (!downloaded) {
                                        viewModel.downloadAudioSurah(surah.number)
                                    } else {
                                        viewModel.jumpToSurah(surah.number)
                                    }
                                },
                                modifier = Modifier.weight(1f),
                            ) {
                                Icon(
                                    if (downloaded) Icons.Rounded.CheckCircle else Icons.Rounded.Download,
                                    contentDescription = null,
                                    tint = GoldBright,
                                )
                                Spacer(Modifier.width(6.dp))
                                Text(if (downloaded) "محمّلة" else "تحميل", color = GoldBright)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun QuranSettingsView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    val goalOptions = listOf(0, 2, 5, 10, 20)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            QuranSettingsCard(title = "الورد اليومي") {
                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    goalOptions.forEach { goal ->
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = if (quran.dailyGoal == goal) GoldBright else Color(0x22D4A853),
                            modifier = Modifier.clickable { viewModel.setQuranDailyGoal(goal) },
                        ) {
                            Text(
                                text = if (goal == 0) "بدون" else "$goal صفحات",
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                color = if (quran.dailyGoal == goal) QuranInk else GoldBright,
                            )
                        }
                    }
                }
                Text(
                    text = "قرأت اليوم ${quran.dailyLog.pagesRead.size} صفحة.",
                    color = GoldLight.copy(alpha = 0.8f),
                    style = MaterialTheme.typography.bodySmall,
                )
            }
        }

        item {
            QuranSettingsCard(title = "التلاوة والصوت") {
                Text(
                    text = "القارئ الحالي: ${quran.selectedReciter.name}",
                    color = GoldBright,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = "السور المحمّلة صوتيًا: ${quran.audio.downloadedSurahs.size}",
                    color = GoldLight.copy(alpha = 0.78f),
                    style = MaterialTheme.typography.bodySmall,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { viewModel.showQuranMode(QuranReaderMode.RECITERS) }) {
                        Text("اختيار قارئ", color = GoldBright)
                    }
                    OutlinedButton(onClick = viewModel::downloadAllSurahs) {
                        Icon(Icons.Rounded.Download, contentDescription = null, tint = GoldBright)
                        Spacer(Modifier.width(6.dp))
                        Text("تحميل الكل", color = GoldBright)
                    }
                }
                quran.audio.bulkDownloadLabel?.let {
                    Text(it, color = GoldLight.copy(alpha = 0.75f))
                }
            }
        }

        item {
            QuranSettingsCard(title = "الموضع الحالي") {
                Text(
                    text = "الصفحة الحالية: ${quran.currentPage}",
                    color = GoldBright,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = "يمكنك العودة دائمًا إلى موضعك الأخير داخل القارئ.",
                    color = GoldLight.copy(alpha = 0.78f),
                    style = MaterialTheme.typography.bodySmall,
                )
                OutlinedButton(onClick = { viewModel.showQuranMode(QuranReaderMode.READER) }) {
                    Text("العودة إلى القراءة", color = GoldBright)
                }
            }
        }
    }
}

@Composable
private fun QuranAchievementsView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    val maxPages = (quran.stats.dayBars.maxOfOrNull { it.second } ?: 1).coerceAtLeast(1)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                QuranMetricCard("السلسلة", "${quran.stats.streakDays}", Modifier.weight(1f))
                QuranMetricCard("الصفحات", "${quran.stats.totalPagesLast30Days}", Modifier.weight(1f))
                QuranMetricCard("أيام القراءة", "${quran.stats.daysReadLast30Days}", Modifier.weight(1f))
            }
        }

        item {
            Surface(shape = RoundedCornerShape(24.dp), color = Color(0xFF14100A)) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text("آخر 30 يوم", color = GoldBright, fontWeight = FontWeight.Bold)
                    if (quran.stats.dayBars.isEmpty()) {
                        Text("ابدأ القراءة ليظهر التقدّم هنا.", color = GoldLight.copy(alpha = 0.72f))
                    } else {
                        quran.stats.dayBars.takeLast(14).forEach { (label, pages) ->
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                ) {
                                    Text(label, color = GoldLight.copy(alpha = 0.72f), style = MaterialTheme.typography.bodySmall)
                                    Text("$pages صفحة", color = GoldBright, style = MaterialTheme.typography.bodySmall)
                                }
                                Surface(shape = RoundedCornerShape(999.dp), color = Color.White.copy(alpha = 0.08f)) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth(pages / maxPages.toFloat())
                                            .height(8.dp)
                                            .background(GoldBright),
                                    )
                                }
                            }
                        }
                    }
                    OutlinedButton(onClick = { viewModel.showQuranMode(QuranReaderMode.READER) }) {
                        Text("العودة إلى القراءة", color = GoldBright)
                    }
                }
            }
        }
    }
}

@Composable
private fun QuranRecitersView(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(quran.reciters) { reciter ->
            val isSelected = reciter.id == quran.selectedReciter.id
            Surface(
                shape = RoundedCornerShape(22.dp),
                color = if (isSelected) Color(0x22D4A853) else Color(0xFF14100A),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        viewModel.selectReciter(reciter)
                        viewModel.showQuranMode(
                            if (quran.download.isDownloaded) QuranReaderMode.READER else QuranReaderMode.DOWNLOAD,
                        )
                    },
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(reciter.name, color = GoldBright, fontWeight = FontWeight.Bold)
                        Text(
                            text = if (isSelected) "القارئ المحدد حاليًا" else "اضغط للتبديل إليه",
                            color = GoldLight.copy(alpha = 0.72f),
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                    if (isSelected) {
                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = GoldBright)
                    }
                }
            }
        }
    }
}

@Composable
private fun QuranAudioBar(
    quran: QuranUiState,
    viewModel: FaithfulMainViewModel,
) {
    val targetSurah = quran.audio.currentSurah.takeIf { it > 0 } ?: quran.pageGroups.firstOrNull()?.surahNum ?: return
    val targetMeta = quran.surahs.firstOrNull { it.number == targetSurah }
    val downloaded = quran.audio.downloadedSurahs.contains(targetSurah)
    val label = quran.audio.label.ifBlank {
        if (targetMeta == null) "استمع إلى التلاوة" else "سورة ${targetMeta.name}"
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        shape = RoundedCornerShape(22.dp),
        color = Color(0xFF14100A),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(label, color = GoldBright, fontWeight = FontWeight.Bold)
            Text(
                text = if (downloaded) "التلاوة متاحة بدون إنترنت" else "يمكنك الاستماع الآن أو تنزيل السورة للحفظ المحلي",
                color = GoldLight.copy(alpha = 0.72f),
                style = MaterialTheme.typography.bodySmall,
            )
            quran.audio.singleDownloadLabel?.let { StatusBanner(it) }
            quran.audio.bulkDownloadLabel?.let { StatusBanner(it) }
            Row(
                modifier = Modifier.horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                AudioControlButton(Icons.Rounded.SkipPrevious, viewModel::prevAyahInQueue)
                AudioControlButton(
                    if (quran.audio.isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                    onClick = {
                        if (quran.audio.currentSurah == 0) {
                            viewModel.playSurah(targetSurah)
                        } else {
                            viewModel.toggleReaderPlayPause()
                        }
                    },
                )
                AudioControlButton(Icons.Rounded.SkipNext, viewModel::skipNextSurah)
                AudioControlButton(
                    if (downloaded) Icons.Rounded.CheckCircle else Icons.Rounded.Download,
                    onClick = {
                        if (!downloaded) {
                            viewModel.downloadAudioSurah(targetSurah)
                        } else {
                            viewModel.playSurah(targetSurah)
                        }
                    },
                )
                OutlinedButton(onClick = viewModel::downloadAllSurahs) {
                    Text("تحميل الكل", color = GoldBright)
                }
            }
        }
    }
}

@Composable
private fun AudioControlButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color(0x22D4A853),
        modifier = Modifier.clickable(onClick = onClick),
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = GoldBright,
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .size(20.dp),
        )
    }
}

@Composable
private fun QuranSettingsCard(
    title: String,
    content: @Composable () -> Unit,
) {
    Surface(shape = RoundedCornerShape(24.dp), color = Color(0xFF14100A)) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(title, color = GoldBright, fontWeight = FontWeight.Bold)
            content()
        }
    }
}

@Composable
private fun QuranMetricCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier,
) {
    Surface(modifier = modifier, shape = RoundedCornerShape(20.dp), color = Color(0xFF14100A)) {
        Column(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(title, color = GoldLight.copy(alpha = 0.72f), style = MaterialTheme.typography.labelMedium)
            Spacer(Modifier.height(6.dp))
            Text(value, color = GoldBright, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
        }
    }
}

@Composable
private fun StatusBanner(text: String) {
    Surface(shape = RoundedCornerShape(14.dp), color = Color(0x22D4A853)) {
        Text(
            text = text,
            color = GoldLight,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            style = MaterialTheme.typography.bodySmall,
        )
    }
}

@Composable
private fun QuranEmptyState(text: String) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(text, color = GoldLight)
    }
}

private fun surahTypeLabel(type: String): String {
    return when (type.lowercase()) {
        "meccan" -> "مكية"
        "medinan" -> "مدنية"
        else -> type
    }
}
