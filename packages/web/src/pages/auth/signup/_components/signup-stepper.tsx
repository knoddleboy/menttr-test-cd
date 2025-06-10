import { Button } from "@/components/ui/button";
import { defineStepper } from "@stepperize/react";

const { useStepper, steps, utils } = defineStepper(
  {
    id: "account",
    title: "Account",
  },
  {
    id: "profile",
    title: "Profile",
  },
  {
    id: "motivation",
    title: "Motivation",
  }
);

const SignupStepper = () => {
  const stepper = useStepper();

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <nav aria-label="Signup steps" className="">
      <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
        {stepper.all.map((step, index, array) => {
          const isCurrentStep = stepper.current.id === step.id;

          return (
            <li key={step.id} className="flex items-center gap-4 flex-shrink-0">
              <Button
                type="button"
                role="tab"
                variant={index <= currentIndex ? "primary" : "secondary"}
                aria-current={isCurrentStep ? "step" : undefined}
                aria-posinset={index + 1}
                aria-setsize={steps.length}
                aria-selected={isCurrentStep}
                className="flex size-10 items-center justify-center rounded-full"
                onClick={() => stepper.goTo(step.id)}
              >
                {index < currentIndex ? "check" : index + 1}
              </Button>
              <span className="text-sm font-medium">{step.title}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { SignupStepper, useStepper };
