import { GeneralChart } from "@/components/general-rechart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function ProfilePage() {
    const dailyData = [
        { date: "9/1", value: 85 },
        { date: "9/2", value: 92 },
        { date: "9/3", value: 88 },
        { date: "9/4", value: 90 },
        { date: "9/5", value: 75 },
        { date: "9/6", value: 95 },
        { date: "9/7", value: 89 },
    ]

    const recentPractice = [
        { id: 1, accuracy: "95%" },
        { id: 2, accuracy: "99%" },
        { id: 3, accuracy: "100%" },
        { id: 4, accuracy: "97%" },
    ]

    return (
        <div className="container mx-auto p-2 space-y-2 text-sm">
            <h1 className="text-lg font-bold">Your profile</h1>

            <div className="grid grid-cols-2 gap-2">
                <Card className="p-2 text-center">
                    <div className="text-base font-bold">7,280</div>
                    <div className="text-[10px] text-muted-foreground">Total practiced</div>
                </Card>
                <Card className="p-2 text-center">
                    <div className="text-base font-bold">99.0%</div>
                    <div className="text-[10px] text-muted-foreground">Accuracy rate</div>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Card className="p-2 text-center">
                    <div className="text-base font-bold">123</div>
                    <div className="text-[10px] text-muted-foreground">Longest streak</div>
                </Card>
                <Card className="p-2 text-center">
                    <div className="text-base font-bold">42</div>
                    <div className="text-[10px] text-muted-foreground">Current streak</div>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Card className="p-2">
                    <h2 className="text-xs font-semibold mb-1">Daily accuracy</h2>
                    <GeneralChart
                        data={dailyData}
                        chartType="line"
                        xKey="date"
                        yKey="value"
                        color="#007bff"
                        height={200}
                    />
                </Card>

                <Card className="p-2">
                    <h2 className="text-xs font-semibold mb-1">Recent practice</h2>
                    <div className="space-y-1">
                        {recentPractice.map((practice) => (
                            <div key={practice.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {/* <Image
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listenum-9BjMYlTNvLnL1WlajLT6dlvv9gvwnb.png"
                                        alt="Practice thumbnail"
                                        width={16}
                                        height={16}
                                        className="rounded-sm"
                                    /> */}
                                    <div className="text-[10px]">Listening Numbers</div>
                                </div>
                                <div className="text-[10px] font-semibold">{practice.accuracy}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="japanese">Japanese</TabsTrigger>
                    <TabsTrigger value="chinese">Chinese</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-1">
                <div className="flex-1">
                    <Label htmlFor="voice-select" className="text-[10px] mb-1 block">
                        Voice
                    </Label>
                    <Select defaultValue="male">
                        <SelectTrigger id="voice-select" className="w-full h-7">
                            <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <Label htmlFor="speed-slider" className="text-[10px] mb-1 block">
                        Speed
                    </Label>
                    <div className="flex items-center gap-1">
                        <Slider id="speed-slider" defaultValue={[50]} max={100} step={1} className="flex-grow" />
                        <span className="text-[10px] w-4">1x</span>
                    </div>
                </div>

                <div className="flex flex-col justify-end">
                    <Button size="sm" className="h-7 px-2">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

