import React, {Fragment, useContext, useEffect} from 'react';
import {Comment, Button, Form, Header, Segment} from "semantic-ui-react";
import {RootStoreContext} from "../../../app/stores/rootStore";
import {Field, Form as FinalForm} from 'react-final-form';
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import {observer} from "mobx-react-lite";
import {formatDistance} from "date-fns";
import {Link} from "react-router-dom";


const ActivityDetailChat = () => {

    const {activityStore} = useContext(RootStoreContext);
    const {connectCommentHub, disconnectCommentHub, addComment, activity} = activityStore;


    useEffect(() => {
        connectCommentHub(activity!.id);

        return () => {
            disconnectCommentHub();
        }
    }, [connectCommentHub, disconnectCommentHub, activity])

    return (
        <Fragment>
            <Segment textAlign='center'
                     attached='top'
                     inverted
                     color='teal'
                     style={{border: 'none'}}>
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {activity?.comments.map(comment => (
                        <Comment key={comment.id as string}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                        </Comment>)
                    )}
                </Comment.Group>
                <FinalForm onSubmit={addComment}
                           render={({handleSubmit, submitting, form}) => (
                               <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}
                                     reply>
                                   <Field name={'body'}
                                          component={TextAreaInput}
                                          rows={2}
                                          placeholder={'Add your comment'}/>
                                   <Button content='Add Reply'
                                           labelPosition='left'
                                           icon='edit'
                                           primary
                                           loading={submitting}/>
                               </Form>)}/>
            </Segment>
        </Fragment>
    )
}


export default observer(ActivityDetailChat);