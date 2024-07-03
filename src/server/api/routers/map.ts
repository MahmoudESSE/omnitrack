import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

const LocationSchema = z.object({
  features: z.array(
    z.object({
      properties: z.object({
        full_address: z.string(),
      }),
    }),
  ),
});

type LocationType = z.infer<typeof LocationSchema>;

export const mapRouter = createTRPCRouter({
  mapAccessToken: protectedProcedure.query(async ({ }) => {
    return {
      mapAccessToken: env.MAPBOX_ACCESS_TOKEN,
      mapStyle: env.MAPBOX_BASIC_STYLE_URL,
    };
  }),

  reverseGeocoding: protectedProcedure
    .input(
      z.object({
        tracker: z.object({
          longitude: z.number(),
          latitude: z.number(),
        }),
      }),
    )
    .query(async ({ input: { tracker } }) => {
      let location: LocationType = {
        features: [{ properties: { full_address: "" } }],
      };

      console.log("Tracker: " + JSON.stringify(tracker));

      console.log(
        `https://api.mapbox.com/search/geocode/v6/reverse?` +
        `longitude=${tracker.longitude}` +
        `&latitude=${tracker.latitude}` +
        `&access_token=${env.MAPBOX_ACCESS_TOKEN}`,
      );

      await fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?` +
        `longitude=${tracker.longitude}` +
        `&latitude=${tracker.latitude}` +
        `&access_token=${env.MAPBOX_ACCESS_TOKEN}`,
      )
        .then((res) => res.json())
        .then((data: LocationType) => {
          console.log(JSON.stringify(data));

          location = data;
        })
        .catch((err) => console.log(JSON.stringify(err)));

      console.log("Location: " + JSON.stringify(location));
      console.log("Tracker: " + JSON.stringify(tracker));
      return location;
    }),
});
