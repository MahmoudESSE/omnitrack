import {
  type SubmitHandler,
  useForm,
  type SubmitErrorHandler,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export const SpeedLimitSchema = z.object({
  speed: z.coerce.number().default(4.0),
});

export type SpeedLimitType = z.infer<typeof SpeedLimitSchema>;

interface FormProps {
  title: string;
  submitText: string;
  speed_limit: SpeedLimitType;
  action: (speed_limit: number) => void;
}


const SpeedLimitForm = ({
  title,
  submitText,
  speed_limit: initialValues,
  action,
}: FormProps) => {
  const form = useForm<SpeedLimitType>({
    resolver: zodResolver(SpeedLimitSchema),
    defaultValues: initialValues,
  });
  const submitHandler: SubmitHandler<SpeedLimitType> = (speed_limit) => {
    console.log("Submitting..." + JSON.stringify(speed_limit.speed));
    action(speed_limit.speed);
  };

  const errorHandler: SubmitErrorHandler<SpeedLimitType> = (errors) => {
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
            name="speed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speed</FormLabel>
                <FormControl>
                  <Input placeholder="Speed" {...field} />
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

export { SpeedLimitForm };
