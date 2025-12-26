import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledInput } from '@src/components/ui';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@pado/ui';

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(50, 'Password must be less than 50 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function Form() {
  const { control, handleSubmit } = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-page px-4">
      <Text className="text-2xl font-bold text-body">Form</Text>
      <View className="w-full gap-4">
        <ControlledInput
          control={control}
          name="name"
          label="Name"
          placeholder="Enter your name"
        />
        <ControlledInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
        />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
        />
      </View>
      <Button
        text="Submit"
        onPress={handleSubmit(onSubmit)}
        isLoading={false}
        color="primary"
        size="default"
        fullWidth={true}
        disabled={false}
      />
    </View>
  );
}
