import {Entypo} from '@expo/vector-icons';
import {Fragment, FunctionComponent} from 'react';
import {View, ViewStyle} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import tw from 'twrnc';

import {Trans} from "@/components/trans";
import {chunked} from "@/lib/utils";

export function StepIcons({
                            serviceId,
                            stepId,
                            steps,
                            style,
                          }: {
  serviceId: string;
  stepId: string;
  steps: { Icon: FunctionComponent<{ color?: string; size?: number; }>; id: string }[];
  style?: ViewStyle,
}) {
  const theme = useTheme();
  const stepIdx = steps.findIndex((step) => step.id === stepId);
  const CHUNK_SIZE = 4;

  return (
    <View style={[tw`gap-4`, style]}>
      {chunked(steps, 4).map((chunk, chunkIdx) => (
        <View key={chunkIdx} style={tw`flex flex-row items-stretch`}>
          {chunk.map(({Icon, id}, index) => (
            <View
              key={id}
              style={tw.style('flex-1 items-center', {})}
            >
              <View style={tw.style('size-16 items-center justify-center rounded-full',
                stepIdx < (chunkIdx * CHUNK_SIZE + index) && 'opacity-30',
                {
                  backgroundColor: stepId === id
                    ? theme.colors.secondary
                    : (stepIdx < (chunkIdx * CHUNK_SIZE + index)
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.primary),
                })}>
                <Icon color={
                  stepId === id
                    ? theme.colors.onSecondary
                    : (stepIdx < (chunkIdx * CHUNK_SIZE + index)
                      ? theme.colors.primary
                      : theme.colors.onPrimary)
                } size={36}/>
              </View>
              <Text numberOfLines={2} style={tw.style('text-center',
                stepIdx < (chunkIdx * CHUNK_SIZE + index) ? 'opacity-70' : 'font-semibold'
              )}>
                <Trans i18nKey={`services.${serviceId}.${id}.stepTitle`}/>
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export function Stepper({
                          stepId,
                          steps,
                          style,
                        }: {
  stepId: string;
  steps: { Icon: FunctionComponent<{ color?: string; size?: number; }>; id: string }[];
  style?: ViewStyle,
}) {
  const theme = useTheme();
  const stepIdx = steps.findIndex((step) => step.id === stepId);

  return (
    <View style={[tw`flex flex-row items-center justify-between`, style]}>
      {steps.map(({Icon, id}, index) => (
        <Fragment key={id}>
          <View style={tw.style('z-10 items-center justify-center rounded-full size-6',
            stepIdx === index && 'size-9',
            stepIdx < index && 'opacity-60',
            {
              backgroundColor: stepIdx < index ? theme.colors.outline : theme.colors.primary,
            })}>
            {stepIdx === index && (<Icon color={theme.colors.onPrimary} size={20}/>)}
            {stepIdx > index && (<Entypo color={theme.colors.onPrimary} name="check" size={16}/>)}
          </View>
          {index < steps.length - 1 && (
            <View style={tw.style('-mx-px h-1 flex-1',
              stepIdx <= index && 'opacity-60',
              {
              backgroundColor: stepIdx <= index ? theme.colors.outline : theme.colors.primary,
            })}/>
          )}
        </Fragment>
      ))}
    </View>
  );
}