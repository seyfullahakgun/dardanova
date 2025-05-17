"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MapPin, Mail, Phone } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const Contact = () => {
  const t = useTranslations("Contact");
  const params = useParams();
  const locale = params.locale as string;

  const formSchema = z.object({
    fullName: z.string().min(2, {
      message: t("validation.fullNameMin"),
    }),
    email: z.string().email({
      message: t("validation.emailInvalid"),
    }),
    phone: z.string().optional(),
    subject: z.string().min(5, {
      message: t("validation.subjectMin"),
    }),
    message: z.string().min(10, {
      message: t("validation.messageMin"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(values),
    });

    toast.success(t("successMessage"), {
      description: t("successDescription"),
    });
    form.reset();
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 41.076579, // İstanbul koordinatları
    lng: 29.013614,
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* İletişim Bilgileri */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">{t("address")}</h3>
              <p className="text-gray-200">
                Ferko Signature Plaza, Esentepe, Büyükdere Cd. No:175 A Blok,{" "}
                <br />
                34394 Şişli/İstanbul
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">{t("email")}</h3>
              <p className="text-gray-200">info@dardanova.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">{t("phone")}</h3>
              <p className="text-gray-200">+90 (544) 282 73 93</p>
            </div>
          </div>

          <div className="mt-8">
            <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
              }
              language={locale}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                  gestureHandling: "none",
                  zoomControl: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                  scrollwheel: false,
                  disableDoubleClickZoom: true,
                  draggable: false,
                  keyboardShortcuts: false,
                }}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-black/10 p-8 rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fullNamePlaceholder")}
                        className="bg-white text-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
                        className="bg-white text-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phoneOptional")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.phonePlaceholder")}
                        className="bg-white text-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.subjectPlaceholder")}
                        className="bg-white text-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.messagePlaceholder")}
                        className="min-h-[150px] bg-white text-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t("send")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
