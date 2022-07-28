import React, { Component } from 'react';
import { DataSet } from 'vis-data/esnext';
import { Timeline as VisTimelineCtor } from 'vis-timeline/esnext';
import type {
	Timeline as VisTimeline,
	TimelineGroup,
	TimelineItem
} from 'vis-timeline/types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

const divStyle = {
    width: "100%",
    height: "100%",
    marginTop: "10px",
    paddingBottom: "75px"
  };

export class Timeline extends Component<{}> {
	public timeline!: Readonly<VisTimeline>;
	public readonly items: DataSet<TimelineItem>;
	public readonly groups: DataSet<TimelineGroup>;

	#ref = React.createRef<HTMLDivElement>();

	constructor(props: {} | Readonly<{}>) {
		super(props);

		this.items = new DataSet<TimelineItem>();
		this.groups = new DataSet<TimelineGroup>();
	}

	componentWillUnmount() {
		this.timeline.destroy();
	}

	componentDidMount() {
		this.timeline = new VisTimelineCtor(this.#ref.current!, this.items, this.groups, {
            minHeight: "100%"
        });

        return;
	}

	render() {
		return <div ref={this.#ref} style={divStyle} />;
	}
}