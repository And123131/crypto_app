import GradientText from "../components/GradientText"
import Button from "../Button"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <GradientText
        colors={["#5227FF","#FF9FFC","#B19EEF"]}
        animationSpeed={8}
        showBorder={false}
      >
        <h1 className="mb-4 text-3xl">
          Let's predict future together
        </h1>
      </GradientText>

      <Button />
    </div>
  )
}