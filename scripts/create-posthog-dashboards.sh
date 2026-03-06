#!/bin/bash

API_KEY="phx_v2AHlJLodnwX7oDzYDGSV839TzUrwqVwOiJklcStrn5Tw8q"
BASE_URL="https://us.i.posthog.com"
PROJECT_ID="291417"

create_insight() {
  local name="$1"
  local description="$2"
  local query="$3"
  local dashboard_id="$4"

  result=$(curl -s -X POST "$BASE_URL/api/projects/$PROJECT_ID/insights/" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"description\": \"$description\",
      \"query\": $query,
      \"dashboards\": [$dashboard_id]
    }")

  echo "  ✓ $name"
}

create_dashboard() {
  local name="$1"
  local description="$2"

  result=$(curl -s -X POST "$BASE_URL/api/projects/$PROJECT_ID/dashboards/" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"description\": \"$description\"
    }")

  echo "$result" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])"
}

echo "=== PostHog 대시보드 생성 ==="
echo ""

# Dashboard 1: 전체 유저 여정
echo "📊 대시보드 1: 전체 유저 여정"
D1=$(create_dashboard "전체 유저 여정" "온보딩부터 콘텐츠 완료까지 전체 퍼널")

create_insight "전체 Funnel" "온보딩 → 로그인 → 콘텐츠 클릭 → 완료" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "FunnelsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_onboard_start"},
      {"kind": "EventsNode", "event": "pado_onboard_complete"},
      {"kind": "EventsNode", "event": "pado_login_success"},
      {"kind": "EventsNode", "event": "pado_content_click"},
      {"kind": "EventsNode", "event": "pado_funnel_complete"}
    ],
    "dateRange": {"date_from": "all"},
    "funnelsFilter": {"funnelOrderType": "sequential"}
  }
}' "$D1"

create_insight "DAU (일별 활성 유저)" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_page_view", "math": "dau"}
    ],
    "dateRange": {"date_from": "-30d"},
    "interval": "day"
  }
}' "$D1"

create_insight "리텐션 (D1~D7)" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "RetentionQuery",
    "retentionFilter": {
      "targetEntity": {"id": "pado_login_success", "type": "events"},
      "returningEntity": {"id": "pado_page_view", "type": "events"},
      "retentionType": "retention_first_time",
      "totalIntervals": 8,
      "period": "Day"
    },
    "dateRange": {"date_from": "all"}
  }
}' "$D1"

echo ""

# Dashboard 2: ACT 콘텐츠 성과
echo "📊 대시보드 2: ACT 콘텐츠 성과"
D2=$(create_dashboard "ACT 콘텐츠 성과" "콘텐츠별 클릭, 완료, 이탈 분석")

create_insight "콘텐츠 클릭 → 시작 → 완료 Funnel" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "FunnelsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_content_click"},
      {"kind": "EventsNode", "event": "pado_funnel_intro_next"},
      {"kind": "EventsNode", "event": "pado_funnel_complete"}
    ],
    "dateRange": {"date_from": "all"},
    "funnelsFilter": {"funnelOrderType": "sequential"}
  }
}' "$D2"

create_insight "콘텐츠별 클릭 수" "title로 breakdown" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_content_click", "math": "dau"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month",
    "breakdownFilter": {"breakdowns": [{"property": "title", "type": "event"}]}
  }
}' "$D2"

create_insight "콘텐츠별 완료 수" "title로 breakdown" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_funnel_complete", "math": "dau"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month",
    "breakdownFilter": {"breakdowns": [{"property": "title", "type": "event"}]}
  }
}' "$D2"

create_insight "이탈 단계 분포" "step으로 breakdown" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_funnel_exit", "math": "total"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month",
    "breakdownFilter": {"breakdowns": [{"property": "step", "type": "event"}]}
  }
}' "$D2"

echo ""

# Dashboard 3: 채팅
echo "📊 대시보드 3: 채팅"
D3=$(create_dashboard "채팅" "채팅 진입, 전환, 체류시간")

create_insight "채팅 Funnel" "진입 → 메시지 전송" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "FunnelsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_chat_enter"},
      {"kind": "EventsNode", "event": "pado_chat_send"}
    ],
    "dateRange": {"date_from": "all"},
    "funnelsFilter": {"funnelOrderType": "sequential"}
  }
}' "$D3"

create_insight "채팅 체류시간 (평균)" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_chat_exit", "math": "avg", "math_property": "duration"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month"
  }
}' "$D3"

create_insight "일별 메시지 수" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_chat_send", "math": "total"}
    ],
    "dateRange": {"date_from": "-30d"},
    "interval": "day"
  }
}' "$D3"

echo ""

# Dashboard 4: 로그인 & 온보딩
echo "📊 대시보드 4: 로그인 & 온보딩"
D4=$(create_dashboard "로그인 & 온보딩" "로그인 방식, 성공률, 온보딩 완료율")

create_insight "로그인 방식별 성공" "method로 breakdown" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_login_success", "math": "total"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month",
    "breakdownFilter": {"breakdowns": [{"property": "method", "type": "event"}]}
  }
}' "$D4"

create_insight "로그인 실패" "method로 breakdown" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_login_fail", "math": "total"}
    ],
    "dateRange": {"date_from": "all"},
    "interval": "month",
    "breakdownFilter": {"breakdowns": [{"property": "method", "type": "event"}]}
  }
}' "$D4"

create_insight "온보딩 완료율" "" '{
  "kind": "InsightVizNode",
  "source": {
    "kind": "FunnelsQuery",
    "series": [
      {"kind": "EventsNode", "event": "pado_onboard_start"},
      {"kind": "EventsNode", "event": "pado_onboard_complete"}
    ],
    "dateRange": {"date_from": "all"},
    "funnelsFilter": {"funnelOrderType": "sequential"}
  }
}' "$D4"

echo ""
echo "=== 완료! PostHog Dashboards에서 확인하세요 ==="
