#!/bin/bash

# ============================================
# TeacherPlan — скрипт додавання нового предмету
# Використання: ./add-subject.sh
# ============================================

echo "=================================="
echo "  TeacherPlan — Додавання предмету"
echo "=================================="
echo ""

# 1. Назва предмету (як в дашборді)
read -p "Назва предмету (укр): " SUBJECT_NAME
# Наприклад: Фізика

# 2. ID предмету (латиниця, через дефіс)
read -p "ID предмету (латиниця): " SUBJECT_ID
# Наприклад: physics

# 3. Назва функції генератора
read -p "Назва функції генератора: " FUNC_NAME
# Наприклад: generatePhysicsCalendarPlan

# 4. Назва файлу плану (без .ts)
read -p "Назва файлу плану (без .ts): " PLAN_FILE
# Наприклад: physics-plan

# 5. Класи (через кому)
read -p "Класи (через кому, напр. 7,8,9,10,11): " CLASSES_RAW

# 6. Назви програм у дашборді
echo ""
echo "Скільки програм у цього предмету? (наприклад 1 або 2)"
read -p "Кількість програм: " PROG_COUNT

PROGRAMS_CODE=""
for i in $(seq 1 $PROG_COUNT); do
  echo ""
  echo "--- Програма $i ---"
  read -p "  Назва програми: " PROG_NAME
  read -p "  ID програми: " PROG_ID
  read -p "  Класи (через кому): " PROG_CLASSES
  read -p "  Опис: " PROG_DESC
  read -p "  Год/тиждень (число або діапазон напр. 2 або 1,2): " PROG_LPW

  # Форматуємо lessonsPerWeek
  if [[ $PROG_LPW == *","* ]]; then
    IFS=',' read -ra LPW_PARTS <<< "$PROG_LPW"
    LPW_VALUE="[${LPW_PARTS[0]}, ${LPW_PARTS[1]}]"
  else
    LPW_VALUE="$PROG_LPW"
  fi

  # Форматуємо classes
  IFS=',' read -ra CLASS_PARTS <<< "$PROG_CLASSES"
  CLASSES_ARR=$(printf '%s,' "${CLASS_PARTS[@]}" | sed 's/,$//')
  CLASSES_ARR=$(echo $CLASSES_ARR | sed 's/\([0-9]*\)/\1/g')

  PROGRAMS_CODE+="
    \"$PROG_NAME\": {
      id: \"$PROG_ID\",
      classes: [$(echo $PROG_CLASSES | sed 's/,/, /g')],
      description: \"$PROG_DESC\",
      lessonsPerWeek: $LPW_VALUE,
      hasVariant: false,
    },"
done

echo ""
echo "=================================="
echo "Вношу зміни в файли..."
echo "=================================="

# ==========================================
# 1. route.ts — додаємо else if перед Захист України
# ==========================================
ROUTE_FILE="app/api/documents/generate/route.ts"
ROUTE_INSERT="      } else if (formData.subject === \"$SUBJECT_NAME\") {
        const { $FUNC_NAME } = await import(\"@/lib/generation/$PLAN_FILE\");
        const result = $FUNC_NAME(formData);
        lessons = result.lessons || [];
        planSettings = result;
"

# Вставляємо перед рядком з "Захист України"
sed -i '' "s/} else if (formData.subject === \"Захист України\") {/$ROUTE_INSERT\n      } else if (formData.subject === \"Захист України\") {/" "$ROUTE_FILE"

echo "✅ route.ts оновлено"

# ==========================================
# 2. all-subjects.ts — додаємо перед defense-of-ukraine
# ==========================================
ALL_SUBJECTS_FILE="lib/generation/all-subjects.ts"

# Форматуємо classes для all-subjects
IFS=',' read -ra CLASS_ARR <<< "$CLASSES_RAW"
CLASSES_STR=$(printf "'%s'," "${CLASS_ARR[@]}" | sed "s/,$//")

ALL_SUBJECTS_INSERT="  { id: '$SUBJECT_ID', name: '$SUBJECT_NAME', classes: [$CLASSES_STR], hasModules: true },"

sed -i '' "s/{ id: 'defense-of-ukraine'/$ALL_SUBJECTS_INSERT\n  { id: 'defense-of-ukraine'/" "$ALL_SUBJECTS_FILE"

echo "✅ all-subjects.ts оновлено"

# ==========================================
# 3. dashboard/page.tsx — додаємо перед Захист України
# ==========================================
DASHBOARD_FILE="app/dashboard/page.tsx"

DASHBOARD_INSERT="  \"$SUBJECT_NAME\": {$PROGRAMS_CODE
  },"

sed -i '' "s/\"Захист України\": {/$DASHBOARD_INSERT\n  \"Захист України\": {/" "$DASHBOARD_FILE"

echo "✅ dashboard/page.tsx оновлено"

# ==========================================
# 4. Git push
# ==========================================
echo ""
read -p "Зробити git commit і push? (y/n): " DO_PUSH

if [ "$DO_PUSH" = "y" ]; then
  git add .
  git commit -m "Add subject: $SUBJECT_NAME"
  git push
  echo ""
  echo "🚀 Задеплоєно!"
fi

echo ""
echo "=================================="
echo "✅ Готово! Предмет '$SUBJECT_NAME' додано."
echo "Не забудь скопіювати файли модулів в lib/generation/"
echo "=================================="
