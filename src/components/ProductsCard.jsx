import { ResourceItem, ResourceList, Thumbnail, Icon } from "@shopify/polaris";
import { MobileCancelMajor } from "@shopify/polaris-icons";
import React, { useMemo } from "react";

export function ProductsCard() {
  const dataArray = useMemo(() => {
    if (props.data) {
      if (props.data.selection) {
        return props.data.selection.map((product) => {
          let image = "";
          if (product.images) {
            image = product.images[0].originalSrc;
          }
          return { name: product.title, image: image };
        });
      }
    }
    return [];
  }, [props.data]);

  return (
    <ResourceList
    resourceName={{ singular: "product", plural: "products" }}
    items={dataArray}
    renderItem={(item) => {
      const { name, image } = item;
      const media = <Thumbnail size="medium" source={image} />;

      return (
        // cho vao 1 cai file roi neu hover thi moi hien ra
        <ResourceItem id={name} media={media}>
          <div style={{ width: "100%", position: "relative" }}>{name}</div>
          <button style={{ position: "absolute", right: 0 }}>
            <Icon source={MobileCancelMajor} />
          </button>
        </ResourceItem>
      );
    }}
  />
  );
}

function randomTitle() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  return `${adjective} ${noun}`;
}

const ADJECTIVES = [
  "autumn",
  "hidden",
  "bitter",
  "misty",
  "silent",
  "empty",
  "dry",
  "dark",
  "summer",
  "icy",
  "delicate",
  "quiet",
  "white",
  "cool",
  "spring",
  "winter",
  "patient",
  "twilight",
  "dawn",
  "crimson",
  "wispy",
  "weathered",
  "blue",
  "billowing",
  "broken",
  "cold",
  "damp",
  "falling",
  "frosty",
  "green",
  "long",
  "late",
  "lingering",
  "bold",
  "little",
  "morning",
  "muddy",
  "old",
  "red",
  "rough",
  "still",
  "small",
  "sparkling",
  "throbbing",
  "shy",
  "wandering",
  "withered",
  "wild",
  "black",
  "young",
  "holy",
  "solitary",
  "fragrant",
  "aged",
  "snowy",
  "proud",
  "floral",
  "restless",
  "divine",
  "polished",
  "ancient",
  "purple",
  "lively",
  "nameless",
];

const NOUNS = [
  "waterfall",
  "river",
  "breeze",
  "moon",
  "rain",
  "wind",
  "sea",
  "morning",
  "snow",
  "lake",
  "sunset",
  "pine",
  "shadow",
  "leaf",
  "dawn",
  "glitter",
  "forest",
  "hill",
  "cloud",
  "meadow",
  "sun",
  "glade",
  "bird",
  "brook",
  "butterfly",
  "bush",
  "dew",
  "dust",
  "field",
  "fire",
  "flower",
  "firefly",
  "feather",
  "grass",
  "haze",
  "mountain",
  "night",
  "pond",
  "darkness",
  "snowflake",
  "silence",
  "sound",
  "sky",
  "shape",
  "surf",
  "thunder",
  "violet",
  "water",
  "wildflower",
  "wave",
  "water",
  "resonance",
  "sun",
  "wood",
  "dream",
  "cherry",
  "tree",
  "fog",
  "frost",
  "voice",
  "paper",
  "frog",
  "smoke",
  "star",
];
