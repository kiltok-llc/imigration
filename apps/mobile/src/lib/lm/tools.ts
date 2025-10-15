export type LMTool = {
  description: string;
  func: Function;
  parameters: {
    [key: string]: Parameter;
  };
};

type Parameter = {
  description: string;
  required?: boolean;
  type: string;
};

export const useChipsPrompt = () => {
  return [
    'Chips (VERY IMPORTANT):',
    '- You can use chips with the showActionChip tool to MASSIVELY enhance the user experience.',
    '- IMPORTANT: Use chips AS MUCH AS POSSIBLE! There is NO downside to using chips.',
    '- ALWAYS use chips when you can.',
    '- When thinking, ALWAYS ask yourself if any action chips are applicable.',
  ].join('\n');
};
