# Cybersecurity Attacks Dataset Analysis
# Dataset source: https://github.com/incribo-inc/cybersecurity_attacks

import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import seaborn as sns
import numpy as np

# ── Configuration ──────────────────────────────────────────────────────────────
DATASET_URL = (
    "https://raw.githubusercontent.com/incribo-inc/cybersecurity_attacks"
    "/main/cybersecurity_attacks.csv"
)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

sns.set_theme(style="whitegrid", palette="Set2")

# ── Load dataset ───────────────────────────────────────────────────────────────
print("Loading dataset …")
df = pd.read_csv(DATASET_URL)

# ══════════════════════════════════════════════════════════════════════════════
# 1.1  Dataset structure – first few rows
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 70)
print("1.1  FIRST FEW ROWS OF THE DATASET")
print("=" * 70)
print(f"\nDataset shape : {df.shape[0]:,} rows × {df.shape[1]} columns\n")
print("Column names :")
for i, col in enumerate(df.columns, 1):
    print(f"  {i:>2}. {col}")
print("\nFirst 5 rows:")
print(df.head().to_string())

# ══════════════════════════════════════════════════════════════════════════════
# 1.2  Missing Values – identify and handle
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 70)
print("1.2  MISSING VALUES")
print("=" * 70)

missing_before = df.isnull().sum()
missing_pct = (missing_before / len(df) * 100).round(2)
missing_report = pd.DataFrame(
    {"Missing Count": missing_before, "Missing %": missing_pct}
)
missing_report = missing_report[missing_report["Missing Count"] > 0]
print("\nColumns with missing values (before cleaning):")
print(missing_report.to_string())

# Strategy:
#   • Malware Indicators   (~50 % missing) → fill with "None Detected"
#     (absence of a reported indicator is meaningful information)
#   • Alerts/Warnings      (~50 % missing) → fill with "No Alert"
#   • Proxy Information    (~50 % missing) → fill with "No Proxy"
#   • Firewall Logs        (~50 % missing) → fill with "Not Logged"
#   • IDS/IPS Alerts       (~50 % missing) → fill with "No Alert"
fill_map = {
    "Malware Indicators": "None Detected",
    "Alerts/Warnings": "No Alert",
    "Proxy Information": "No Proxy",
    "Firewall Logs": "Not Logged",
    "IDS/IPS Alerts": "No Alert",
}
df = df.fillna(fill_map)

print("\nHandling strategy: fill categorical missing values with a sentinel")
for col, val in fill_map.items():
    print(f"  • '{col}' → filled with '{val}'")

print(f"\nTotal missing values after cleaning: {df.isnull().sum().sum()}")

# ══════════════════════════════════════════════════════════════════════════════
# 1.3  Attack frequency by Month and Attack Type
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 70)
print("1.3  ATTACK FREQUENCY BY MONTH AND ATTACK TYPE")
print("=" * 70)

df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Month"] = df["Timestamp"].dt.month
df["Month_Name"] = df["Timestamp"].dt.strftime("%b")  # e.g. Jan, Feb …

month_attack = (
    df.groupby(["Month", "Month_Name", "Attack Type"])
    .size()
    .reset_index(name="Count")
    .sort_values("Month")
)

print("\nAttacks per month and attack type:")
print(month_attack.to_string(index=False))

# Insight summary
peak_month = (
    df.groupby(["Month", "Month_Name"]).size().reset_index(name="Count")
)
peak_row = peak_month.loc[peak_month["Count"].idxmax()]
print(
    f"\nInsight: The busiest month overall is {peak_row['Month_Name']}"
    f" with {peak_row['Count']:,} recorded attacks."
)

top_type = df["Attack Type"].value_counts().idxmax()
print(f"Insight: '{top_type}' is the most frequent attack type overall.")

# ── Plot: stacked bar chart ────────────────────────────────────────────────────
pivot = month_attack.pivot_table(
    index=["Month", "Month_Name"], columns="Attack Type", values="Count", fill_value=0
).reset_index().sort_values("Month")

month_labels = pivot["Month_Name"].tolist()
attack_types = [c for c in pivot.columns if c not in ("Month", "Month_Name")]

fig, ax = plt.subplots(figsize=(12, 6))
bottom = np.zeros(len(pivot))
colors = sns.color_palette("Set2", len(attack_types))
for idx, atype in enumerate(attack_types):
    ax.bar(
        month_labels,
        pivot[atype].values,
        bottom=bottom,
        label=atype,
        color=colors[idx],
        edgecolor="white",
        linewidth=0.5,
    )
    bottom += pivot[atype].values

ax.set_title("Number of Attacks per Month by Attack Type", fontsize=14, fontweight="bold")
ax.set_xlabel("Month", fontsize=11)
ax.set_ylabel("Number of Attacks", fontsize=11)
ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, _: f"{int(x):,}"))
ax.legend(title="Attack Type", bbox_to_anchor=(1.01, 1), loc="upper left")
plt.tight_layout()
out_path = os.path.join(OUTPUT_DIR, "attacks_by_month_and_type.png")
plt.savefig(out_path, dpi=150)
plt.close()
print(f"\nChart saved → {out_path}")

# ── Plot: heat-map ─────────────────────────────────────────────────────────────
heatmap_data = month_attack.pivot_table(
    index="Attack Type", columns="Month_Name", values="Count", fill_value=0
)
# Reorder months chronologically
ordered_months = [
    m for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    if m in heatmap_data.columns
]
heatmap_data = heatmap_data[ordered_months]

fig, ax = plt.subplots(figsize=(14, 4))
sns.heatmap(
    heatmap_data.astype(int),
    annot=True,
    fmt=",d",
    cmap="YlOrRd",
    linewidths=0.5,
    ax=ax,
)
ax.set_title("Heatmap: Attack Frequency by Month and Type", fontsize=13, fontweight="bold")
ax.set_xlabel("Month")
ax.set_ylabel("Attack Type")
plt.tight_layout()
out_path = os.path.join(OUTPUT_DIR, "heatmap_attacks_month_type.png")
plt.savefig(out_path, dpi=150)
plt.close()
print(f"Chart saved → {out_path}")

# ══════════════════════════════════════════════════════════════════════════════
# 1.4  Packet Length Distribution by Attack Type
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 70)
print("1.4  PACKET LENGTH DISTRIBUTION BY ATTACK TYPE")
print("=" * 70)

stats = df.groupby("Attack Type")["Packet Length"].describe().round(2)
print("\nDescriptive statistics for Packet Length per Attack Type:")
print(stats.to_string())

# ── Plot: overlapping KDE ──────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 5))
for atype in df["Attack Type"].unique():
    subset = df.loc[df["Attack Type"] == atype, "Packet Length"]
    sns.kdeplot(subset, label=atype, fill=True, alpha=0.35, ax=ax)

ax.set_title("Packet Length Distribution by Attack Type (KDE)", fontsize=13, fontweight="bold")
ax.set_xlabel("Packet Length (bytes)", fontsize=11)
ax.set_ylabel("Density", fontsize=11)
ax.legend(title="Attack Type")
plt.tight_layout()
out_path = os.path.join(OUTPUT_DIR, "packet_length_kde.png")
plt.savefig(out_path, dpi=150)
plt.close()
print(f"\nChart saved → {out_path}")

# ── Plot: box plot ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
sns.boxplot(
    data=df,
    x="Attack Type",
    y="Packet Length",
    hue="Attack Type",
    palette="Set2",
    legend=False,
    ax=ax,
    flierprops=dict(marker="o", markersize=2, alpha=0.4),
)
ax.set_title("Packet Length Distribution by Attack Type (Box Plot)", fontsize=13, fontweight="bold")
ax.set_xlabel("Attack Type", fontsize=11)
ax.set_ylabel("Packet Length (bytes)", fontsize=11)
plt.tight_layout()
out_path = os.path.join(OUTPUT_DIR, "packet_length_boxplot.png")
plt.savefig(out_path, dpi=150)
plt.close()
print(f"Chart saved → {out_path}")

# ── Plot: violin plot ──────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
sns.violinplot(
    data=df,
    x="Attack Type",
    y="Packet Length",
    hue="Attack Type",
    palette="Set2",
    legend=False,
    inner="quartile",
    ax=ax,
)
ax.set_title("Packet Length Distribution by Attack Type (Violin Plot)", fontsize=13, fontweight="bold")
ax.set_xlabel("Attack Type", fontsize=11)
ax.set_ylabel("Packet Length (bytes)", fontsize=11)
plt.tight_layout()
out_path = os.path.join(OUTPUT_DIR, "packet_length_violin.png")
plt.savefig(out_path, dpi=150)
plt.close()
print(f"Chart saved → {out_path}")

print("\n" + "=" * 70)
print("Analysis complete.  All charts saved to:", OUTPUT_DIR)
print("=" * 70)
