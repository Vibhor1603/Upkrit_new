from graphviz import Digraph

def create_use_case_diagram():
    # Initialize the diagram
    diagram = Digraph(format='png')
    diagram.attr(rankdir='LR', size='8,5')

    # Define the actors
    diagram.node('User', shape='ellipse', label='User', style='filled', color='lightblue')
    diagram.node('Admin', shape='ellipse', label='Admin', style='filled', color='lightblue')
    diagram.node('Official', shape='ellipse', label='Upkrit Official', style='filled', color='lightblue')

    # Define the use cases
    use_cases = {
        'Register Complaints': 'Register Complaints',
        'Complaint Analysis': 'Complaint Analysis',
        'Fetching Details': 'Fetching Details',
        'Provide Info': 'Provide Relevant Information',
        'Join Community': 'Join/Start a Drive or Community',
        'Waste Management Excerpts': 'Excerpts on Waste Management',
        'Participate and Earn': 'Participate in Events and Earn Rewards',
        'AI Waste Detection': 'AI Waste Detection',
        'Appropriate Response': 'Appropriate Response',
    }

    for use_case in use_cases:
        diagram.node(use_case, shape='ellipse', label=use_cases[use_case], style='filled', color='lightyellow')

    # Add relationships
    diagram.edge('User', 'Register Complaints')
    diagram.edge('User', 'Join Community')
    diagram.edge('User', 'Waste Management Excerpts')
    diagram.edge('User', 'Participate and Earn')
    diagram.edge('User', 'AI Waste Detection')

    diagram.edge('Admin', 'Complaint Analysis')
    diagram.edge('Admin', 'Fetching Details')
    diagram.edge('Admin', 'Provide Info')

    diagram.edge('Official', 'Appropriate Response')

    # Export the diagram
    diagram.render('use_case_diagram', view=True)

# Run the function
create_use_case_diagram()
