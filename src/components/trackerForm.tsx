import {
  type SubmitHandler,
  useForm,
  SubmitErrorHandler,
} from "react-hook-form";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  TrackerSchema,
  type TrackerType,
} from "@/server/helpers/trackerValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

interface FormProps {
  title: string;
  submitText: string;
  tracker?: TrackerType;
  action: (tracker: TrackerType) => void;
}
const TrackerForm = ({
  title,
  submitText,
  tracker: initialValues,
  action,
}: FormProps) => {
  const form = useForm<TrackerType>({
    resolver: zodResolver(TrackerSchema),
    defaultValues: initialValues,
  });
  const submitHandler: SubmitHandler<TrackerType> = (tracker) => {
    console.log("Submitting..." + JSON.stringify(tracker));
    action(tracker);
  };
  const errorHandler: SubmitErrorHandler<TrackerType> = (errors) => {
    console.log(errors);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler, errorHandler)}
        className="space-y-8"
      >
        <DialogHeader>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {title}
          </h3>
        </DialogHeader>
        <div className="py-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracker</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du tracker" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="imei"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>International Mobile Equipment Identity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="IMEI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="speed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vitesse</FormLabel>
                <FormControl>
                  <Input placeholder="Vitesse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">{submitText}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export { TrackerForm };
