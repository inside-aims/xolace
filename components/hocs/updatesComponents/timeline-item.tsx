import React from 'react'
import { UpdateLog } from '@/constants/changeLogs'
import { getVersionColor } from '@/utils/helpers/updateHelpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sparkles, Rocket, Activity, Zap, RefreshCw, Clock, MessageCircle } from 'lucide-react'

interface TimelineItemProps {
    update: UpdateLog
    index: number
}

const getVersionIcon = (type: string) => {
    switch (type) {
      case "major":
        return <Rocket className="h-5 w-5" />
      case "minor":
        return <Sparkles className="h-5 w-5" />
      case "patch":
        return <Zap className="h-5 w-5" />
      default:
        return <RefreshCw className="h-5 w-5" />
    }
  }

const parseChanges = (changes: string[]) => {
    return changes.map((change, index) => {
      if (change.startsWith("**") && change.endsWith("**")) {
        return (
          <h4 key={index} className="font-semibold text-lg mt-4 mb-2 text-foreground">
            {change.replace(/\*\*/g, "")}
          </h4>
        )
      }
      return (
        <p key={index} className="text-muted-foreground mb-1 leading-relaxed">
          {change}
        </p>
      )
    })
  }

const TimelineItem = ({ update, index }: TimelineItemProps) => {
  return (

                  <div
                    key={update.version}
                    className={`relative flex items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:items-center`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 md:left-1/2 w-8 h-8 ${getVersionColor(update.type || "patch")} rounded-full flex items-center justify-center text-white transform md:-translate-x-4 z-10 shadow-lg`}
                    >
                      {getVersionIcon(update.type || "patch")}
                    </div>

                    {/* Content card */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={update.status === "upcoming" ? "secondary" : "default"}
                                className="text-xs"
                              >
                                v{update.version}
                              </Badge>
                              {update.status === "upcoming" && (
                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {update.date}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-foreground">{update.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">{parseChanges(update.changes)}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
  )
}

export default TimelineItem