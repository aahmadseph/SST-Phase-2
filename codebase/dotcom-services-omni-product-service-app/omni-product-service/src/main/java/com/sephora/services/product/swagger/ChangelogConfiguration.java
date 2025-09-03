package com.sephora.services.product.swagger;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.function.TriFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.TreeMap;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Getter
@Setter
@Slf4j
public class ChangelogConfiguration {

    public static final String GIT_LINK_FORMAT = "<a href=\"https://github.com/Sephora-US-Digital/dotcom-services-omni-product-service-app/commit/%s\">%s</a>";

    private static final Comparator<ChangeLogItem> CHANGE_LOG_ITEM_COMPARATOR = Comparator.comparing(ChangeLogItem::date, Comparator.reverseOrder());
    private static final Comparator<LocalDate> LOCAL_DATE_COMPARATOR = Comparator.reverseOrder();

    private static final TriFunction<String, String, String, String> WRAP = (s, left, right) -> left + s + right;
    private static final Function<String, String> OPEN_TAG = (tag) -> "<" + tag + ">";
    private static final Function<String, String> CLOSE_TAG = (tag) -> "</" + tag + ">";
    private static final BiFunction<String, String, String> WRAP_TAG = (s, tag) -> WRAP.apply(s, OPEN_TAG.apply(tag), CLOSE_TAG.apply(tag));

    @Value("classpath:changelog.json")
    private Resource resource;

    @Autowired
    private ObjectMapper objectMapper;

    public String formatedChangeLog() {
        var logLines = readFromResource();
        if (CollectionUtils.isNotEmpty(logLines)) {
            var logLinesMap = logLines.stream()
                    .filter(log -> log.date() != null)
                    .collect(Collectors.groupingBy(
                            log -> log.date().toLocalDate(),
                            () -> new TreeMap<>(LOCAL_DATE_COMPARATOR),
                            Collectors.toList()));
            StringBuilder recentCommits = new StringBuilder();
            recentCommits.append(WRAP_TAG.apply("Recent commits:", "h4"));
            logLinesMap.forEach((d, l) -> recentCommits.append(createExpand(String.valueOf(d), logLines(l))));
            return recentCommits.toString();
        }
        return StringUtils.EMPTY;
    }

    List<ChangeLogItem> readFromResource() {
        if (resource.exists() && resource.isReadable()) {
            try {
                return Arrays.asList(objectMapper.readValue(resource.getInputStream(),
                        ChangeLogItem[].class));
            } catch (IOException e) {
                log.error("Can not deserialize change log ", e);
            }
        } else {
            log.error("The file 'changelog.json' is not exist or not readable ");
        }
        return Collections.emptyList();
    }

    private String createExpand(String title, String content) {
        return WRAP_TAG.apply(WRAP_TAG.apply(title, "summary") + WRAP_TAG.apply(content, "p"), "details");
    }

    private String logLine(ChangeLogItem logItem) {
        return WRAP_TAG.apply(
                StringUtils.joinWith(" ", getCommitLink(logItem.id),
                        logItem.date().toLocalTime(), WRAP.apply(logItem.authorName(), "[", "]"), logItem.message()),
                "li"
        );
    }

    private String logLines(Collection<ChangeLogItem> logItems) {
        return WRAP_TAG.apply(
                logItems.stream().sorted(CHANGE_LOG_ITEM_COMPARATOR)
                        .map(this::logLine)
                        .collect(Collectors.joining()),
                "ul");
    }

    private String getCommitLink(String commitId) {
        return String.format(GIT_LINK_FORMAT, commitId, StringUtils.left(commitId, 6));
    }

    public record ChangeLogItem(
            String authorEmail,
            String authorName,
            String committerEmail,
            String committerName,
            @JsonFormat
                    (shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss Z", timezone = "America/Los_Angeles")
            @JsonDeserialize (using = ZonedDateTimeJsonDeserializer.class)
            ZonedDateTime date,
            String id,
            String message,
            List<Tag> tags
    ) {
    }

    public record Tag(
            String name
    ) {
    }
}
